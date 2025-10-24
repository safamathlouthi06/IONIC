import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
  IonItem, IonLabel, IonInput, IonButton, IonTextarea, IonSelect, IonSelectOption, IonIcon
} from '@ionic/angular/standalone';

import { ProductService, Product } from '../../services/product';

// Décorateur Component qui définit les métadonnées du composant
@Component({
  selector: 'app-edit-product', // Sélecteur HTML pour ce composant
  templateUrl: './edit-product.page.html', // Template associé
  styleUrls: ['./edit-product.page.scss'], // Feuilles de style SCSS
  standalone: true, // Composant autonome (Angular 14+)
  imports: [
    CommonModule, FormsModule, // Modules Angular standards
    // Composants Ionic importés individuellement (approche standalone)
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButtons, IonBackButton,
    IonItem, IonLabel, IonInput, IonButton, IonTextarea,
    IonSelect, IonSelectOption // ✅ Note: IonIcon est importé mais pas déclaré dans les imports
  ]
})
export class EditProductPage implements OnInit {
  // Objet produit avec des valeurs par défaut
  product: Product = { 
    id: '', 
    name: '', 
    price: 0, 
    description: '', 
    category: '', 
    imageUrl: '', 
    ownerId: '' 
  };
  
  // URL de prévisualisation de l'image (peut être string ou ArrayBuffer)
  previewUrl: string | ArrayBuffer | null = null;
  // Fichier image sélectionné par l'utilisateur
  selectedFile: File | null = null;

  // Injection des services nécessaires
  constructor(
    private route: ActivatedRoute, // Pour accéder aux paramètres de route
    private router: Router, // Pour la navigation
    private productService: ProductService // Service pour gérer les produits
  ) {}

  // Méthode du cycle de vie Angular - exécutée à l'initialisation du composant
  async ngOnInit() {
    // Récupère l'ID du produit depuis les paramètres d'URL
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      try {
        // Charge le produit existant depuis le service
        const existingProduct = await this.productService.getProductById(id);
        if (existingProduct) {
          // Met à jour les données du produit
          this.product = existingProduct;
          this.previewUrl = existingProduct.imageUrl || null;
        } else {
          // Gestion du cas où le produit n'existe pas
          alert('Produit introuvable.');
          this.router.navigate(['/merchant-dashboard']);
        }
      } catch (error) {
        // Gestion des erreurs de chargement
        console.error('Erreur lors du chargement du produit :', error);
        alert('Erreur de chargement du produit.');
      }
    }
  }

  // Gère la sélection d'un fichier image par l'utilisateur
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      // Crée une URL de prévisualisation pour afficher l'image
      const reader = new FileReader();
      reader.onload = () => (this.previewUrl = reader.result);
      reader.readAsDataURL(file);
    }
  }

  // Méthode pour mettre à jour le produit
  async updateProduct() {
    // Validation des champs obligatoires
    if (!this.product.name || !this.product.price || !this.product.category) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    try {
      // Met à jour l'URL de l'image si une nouvelle image a été sélectionnée
      if (this.previewUrl) {
        this.product.imageUrl = this.previewUrl.toString();
      }

      // Appel du service pour mettre à jour le produit en base de données
      await this.productService.updateProduct(this.product);
      alert('Produit mis à jour avec succès !');
      
      // Redirection vers le tableau de bord après succès
      this.router.navigate(['/merchant-dashboard']);
    } catch (error) {
      // Gestion des erreurs de mise à jour
      console.error('Erreur de mise à jour du produit :', error);
      alert('Échec de la mise à jour du produit.');
    }
  }
}