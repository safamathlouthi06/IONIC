import { Component } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart';
import { Product } from '../../services/product';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss']
})
export class CartPage {
  cart: Product[] = [];

  constructor(private cartService: CartService, private toastCtrl: ToastController) {}

  ionViewWillEnter() {
    this.loadCart();
  }

  loadCart() {
    this.cart = this.cartService.getCart();
  }

  removeItem(product: Product) {
    if (!product.id) {
      console.error('Impossible de retirer le produit : ID manquant');
      return;
    }
    this.cartService.removeFromCart(product.id);
    this.loadCart();
    this.showToast('Produit retiré du panier');
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 1500,
      color: 'danger'
    });
    toast.present();
  }
}
