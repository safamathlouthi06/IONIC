import { Component } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { WishlistService } from '../../services/wishlist';
import { CartService } from '../../services/cart';
import { Product } from '../../services/product';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './wishlist.page.html',
  styleUrls: ['./wishlist.page.scss']
})
export class WishlistPage {
  wishlist: Product[] = [];

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService,
    private toastCtrl: ToastController
  ) {}

  ionViewWillEnter() {
    this.loadWishlist();
  }

  loadWishlist() {
    this.wishlist = this.wishlistService.getWishlist();
  }

  removeItem(product: Product) {
    if (!product.id) {
      console.error('Impossible de retirer le produit : ID manquant');
      return;
    }
    this.wishlistService.removeFromWishlist(product.id); // utilise l'ID
    this.loadWishlist();
    this.showToast('Produit retiré de la wishlist', 'danger');
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
    this.showToast('Produit ajouté au panier', 'success');
  }

  async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 1500,
      color
    });
    toast.present();
  }
}
