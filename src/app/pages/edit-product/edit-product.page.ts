import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
  IonItem, IonLabel, IonInput, IonButton, IonTextarea, IonSelect, IonSelectOption, IonIcon
} from '@ionic/angular/standalone';

import { ProductService, Product } from '../../services/product'; // ✅ Correction de l’import

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.page.html',
  styleUrls: ['./edit-product.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButtons, IonBackButton,
    IonItem, IonLabel, IonInput, IonButton, IonTextarea, IonSelect, IonSelectOption
  ]
})
export class EditProductPage implements OnInit {
  product: Product = { id: '', name: '', price: 0, description: '', category: '', imageUrl: '', ownerId: '' };
  previewUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  async ngOnInit() { // ✅ Doit être async
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      try {
        const existingProduct = await this.productService.getProductById(id);
        if (existingProduct) {
          this.product = existingProduct;
          this.previewUrl = existingProduct.imageUrl || null;
        } else {
          alert('Produit introuvable.');
          this.router.navigate(['/merchant-dashboard']);
        }
      } catch (error) {
        console.error('Erreur lors du chargement du produit :', error);
        alert('Erreur de chargement du produit.');
      }
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = e => (this.previewUrl = reader.result);
      reader.readAsDataURL(file);
    }
  }

  async updateProduct() {
    if (!this.product.name || !this.product.price || !this.product.category) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    try {
      // Met à jour l’image si une nouvelle est sélectionnée
      if (this.previewUrl) {
        this.product.imageUrl = this.previewUrl.toString();
      }

      await this.productService.updateProduct(this.product); // ✅ attendre la promesse
      alert('Produit mis à jour avec succès !');
      this.router.navigate(['/merchant-dashboard']); // ✅ meilleure redirection
    } catch (error) {
      console.error('Erreur de mise à jour du produit :', error);
      alert('Échec de la mise à jour du produit.');
    }
  }
}
