import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService, Product } from '../../services/product';
import { StorageService } from '../../services/storage';
import { AuthService, User } from '../../services/auth';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss']
})
export class AddProductPage {
  selectedImageFile: File | null = null; // ✅ On garde le fichier ici

  productForm = this.fb.group({
    name: ['', Validators.required],
    price: [0, Validators.required],
    category: ['', Validators.required],
    description: ['']
  });

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private storageService: StorageService,
    private authService: AuthService,
    private router: Router
  ) {}

  async addProduct() {
    if (this.productForm.valid) {
      const { name, price, description, category } = this.productForm.value as {
        name: string;
        price: number;
        description?: string;
        category: string;
      };

      const user: User | null = await this.authService.getCurrentUser();
      if (!user) {
        alert('❌ Utilisateur non connecté');
        return;
      }

      let imageUrl = '';
      if (this.selectedImageFile) {
        // ✅ Upload correct vers Firebase
        imageUrl = await this.storageService.uploadImage(
          this.selectedImageFile,
          `products/${Date.now()}_${this.selectedImageFile.name}`
        );
      }

      const product: Product = {
        name,
        price,
        description: description || '',
        imageUrl,
        ownerId: user.uid,
        category
      };

      await this.productService.addProduct(product);
      alert('✅ Produit ajouté avec succès !');

      this.productForm.reset();
      this.selectedImageFile = null;

      this.router.navigate(['/merchant-dashboard']);
    } else {
      alert('⚠️ Veuillez remplir tous les champs requis.');
    }
  }

  // ✅ Gérer le changement de fichier correctement
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImageFile = file;
      console.log('📸 Fichier sélectionné :', file.name);
    }
  }
}
