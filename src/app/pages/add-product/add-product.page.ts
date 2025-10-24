import { Component } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService, Product } from '../../services/product';
import { StorageService } from '../../services/storage';
import { AuthService, User } from '../../services/auth';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

// Cette page permet aux commerçants d'ajouter de nouveaux produits à leur boutique
@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss']
})
export class AddProductPage {
  // Liste des catégories disponibles pour classer les produits
  categories = ['Électronique', 'Mode', 'Alimentation', 'Maison', 'Autres'];

  // Formulaire pour saisir les informations du produit
  // Chaque champ a des règles de validation :
  // - name : obligatoire et au moins 2 caractères
  // - price : obligatoire et doit être positif
  // - category : obligatoire
  // - description : maximum 500 caractères
  productForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    price: [0, [Validators.required, Validators.min(0)]],
    category: ['', Validators.required],
    description: ['', Validators.maxLength(500)],
  });

  // Variables pour gérer l'image du produit
  imageSrc: string | undefined = '';  // Aperçu de l'image affiché à l'écran
  imageFile: File | null = null;      // Fichier image à uploader
  isSubmitting: boolean = false;      // Empêche de soumettre plusieurs fois le formulaire

  // Injection des services nécessaires :
  // - fb : pour créer le formulaire
  // - productService : pour enregistrer le produit en base de données
  // - storageService : pour uploader l'image
  // - authService : pour connaître l'utilisateur connecté
  // - router : pour naviguer entre les pages
  // - toastCtrl : pour afficher des messages à l'utilisateur
  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private storageService: StorageService,
    private authService: AuthService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  // Ouvre l'appareil photo ou la galerie pour prendre une photo du produit
  async takePicture() {
    try {
      // Ouvre l'interface de la caméra
      const image = await Camera.getPhoto({
        quality: 90,                    // Qualité de l'image (90%)
        allowEditing: true,             // Permet de recadrer l'image
        resultType: CameraResultType.Base64,  // Retourne l'image en base64
        source: CameraSource.Prompt     // Demande à l'utilisateur de choisir caméra ou galerie
      });

      // Si une image a été prise
      if (image.base64String) {
        const base64Data = image.base64String;
        // Crée un aperçu de l'image pour l'affichage
        this.imageSrc = `data:image/jpeg;base64,${base64Data}`;
        // Convertit l'image base64 en fichier pour l'upload
        this.imageFile = this.base64ToFile(base64Data, `product_${Date.now()}.jpg`);
      }
    } catch (error) {
      console.error('Erreur Camera:', error);
      this.showToast('❌ Erreur lors de la capture photo', 'danger');
    }
  }

  // Convertit une chaîne base64 en fichier JavaScript
  base64ToFile(base64: string, filename: string) {
    // Décode la chaîne base64
    const byteString = atob(base64);
    // Crée un buffer pour stocker les données binaires
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    
    // Remplit le buffer avec les données de l'image
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    
    // Crée un fichier à partir du buffer
    return new File([int8Array], filename, { type: 'image/jpeg' });
  }

  // Ajoute un nouveau produit à la base de données
  async addProduct() {
    // Empêche les doubles clics
    if (this.isSubmitting) return;

    // Vérifie que le formulaire est valide
    if (!this.productForm.valid) {
      this.showToast('⚠️ Veuillez remplir tous les champs requis', 'warning');
      return;
    }

    this.isSubmitting = true;

    try {
      // Récupère les valeurs du formulaire
      const { name, price, category, description } = this.productForm.value as any;
      
      // Vérifie que l'utilisateur est connecté
      const user: User | null = await this.authService.getCurrentUser();
      if (!user) {
        this.showToast('❌ Utilisateur non connecté', 'danger');
        this.isSubmitting = false;
        return;
      }

      // Upload l'image si elle existe
      let imageUrl = '';
      if (this.imageFile) {
        imageUrl = await this.storageService.uploadImage(
          this.imageFile,
          `products/${Date.now()}_${this.imageFile.name}`  // Nom unique pour éviter les conflits
        );
      }

      // Crée l'objet produit avec toutes les informations
      const product: Product = {
        name,
        price,
        description: description || '',  // Description vide si non renseignée
        imageUrl,                       // URL de l'image uploadée
        ownerId: user.uid,              // ID du commerçant propriétaire
        category
      };

      // Enregistre le produit en base de données
      await this.productService.addProduct(product);

      // Affiche un message de succès
      this.showToast('✅ Produit ajouté avec succès !', 'success');
      
      // Réinitialise le formulaire pour pouvoir ajouter un autre produit
      this.productForm.reset();
      this.imageSrc = '';
      this.imageFile = null;
      
      // Redirige vers le tableau de bord après 1 seconde
      // Le délai permet à l'utilisateur de voir le message de succès
      setTimeout(() => {
        this.router.navigate(['/merchant-dashboard']);
      }, 1000);
      
    } catch (error) {
      console.error('Erreur lors de l\'ajout du produit:', error);
      this.showToast('❌ Erreur lors de l\'ajout du produit', 'danger');
    } finally {
      // Réactive le formulaire quoi qu'il arrive (succès ou erreur)
      this.isSubmitting = false;
    }
  }

  // Affiche un message temporaire en bas de l'écran
  async showToast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,    // Le message disparaît après 2 secondes
      color,             // Couleur selon le type de message
      position: 'bottom' // Affiché en bas de l'écran
    });
    await toast.present();
  }

  // Retourne à la page précédente (tableau de bord du commerçant)
  goBack() {
    this.router.navigate(['/merchant-dashboard']);
  }
}