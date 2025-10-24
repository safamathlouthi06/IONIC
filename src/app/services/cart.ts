import { Injectable } from '@angular/core';
import { Product } from './product';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cart: Product[] = [];

  async addToCart(product: Product) {
    this.cart.push(product);
  }

  getCart(): Product[] {
    return this.cart;
  }

  removeFromCart(productId: string) { // <-- prendre un ID et non un objet
    this.cart = this.cart.filter(p => p.id !== productId);
  }

  clearCart() {
    this.cart = [];
  }
}
