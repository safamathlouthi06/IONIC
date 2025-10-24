import { Injectable } from '@angular/core';
import { Product } from './product';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private wishlist: Product[] = [];

  addToWishlist(product: Product) {
    if (!this.wishlist.find(p => p.id === product.id)) {
      this.wishlist.push(product);
    }
  }

  getWishlist(): Product[] {
    return this.wishlist;
  }

  removeFromWishlist(productId: string) {  // <-- on prend l'ID
    this.wishlist = this.wishlist.filter(p => p.id !== productId);
  }
}

  

