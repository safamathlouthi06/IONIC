import { Component } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from '../../services/product';
import { WishlistService } from '../../services/wishlist';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss']
})
export class ProductsPage {
  selectedCategory: string = 'All';
  categories: string[] = ['Électronique', 'Mode', 'Beauté', 'Maison', 'Sport'];
  products: Product[] = [];

  constructor(
    private productService: ProductService,
    private wishlistService: WishlistService,
    private cartService: CartService,
    private toastCtrl: ToastController
  ) {
    this.loadProducts();
  }

  async loadProducts() {
    this.products = await this.productService.getProducts();
  }

  filterProducts(): Product[] {
    if (this.selectedCategory === 'All') return this.products;
    return this.products.filter(p => p.category === this.selectedCategory);
  }

  async addToCart(product: Product) {
    await this.cartService.addToCart(product);
    this.showToast('Produit ajouté au panier !');
  }

  async addToWishlist(product: Product) {
    await this.wishlistService.addToWishlist(product);
    this.showToast('Produit ajouté à la wishlist !');
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 1500,
      color: 'success',
      position: 'top'
    });
    toast.present();
  }

  getCategoryIcon(category: string): string {
  const icons: { [key: string]: string } = {
    'Électronique': 'phone-portrait',
    'Vêtements': 'shirt',
    'Maison': 'home',
    'Sport': 'basketball',
    'Beauté': 'sparkles',
    'Livres': 'book',
    'Jouets': 'game-controller',
    'Automobile': 'car'
  };
  return icons[category] || 'cube';
}
}
