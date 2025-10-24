import { Injectable } from '@angular/core';
import { Product } from './product';

@Injectable({ 
  providedIn: 'root' // Service disponible globalement (singleton)
})
export class WishlistService {
  // Stockage en mémoire de la liste de souhaits
  private wishlist: Product[] = [];

  /**
   * Ajouter un produit à la liste de souhaits
   * @param product - Produit à ajouter
   * 
   * @example
   * this.wishlistService.addToWishlist(product);
   */
  addToWishlist(product: Product) {
    // Vérifie que le produit n'est pas déjà dans la liste
    if (!this.wishlist.find(p => p.id === product.id)) {
      this.wishlist.push(product); // Ajoute le produit
    }
    // Si le produit existe déjà, ne fait rien (évite les doublons)
  }

  /**
   * Récupérer la liste complète des produits favoris
   * @returns Copie du tableau des produits (sécurité)
   * 
   * @example
   * const favorites = this.wishlistService.getWishlist();
   */
  getWishlist(): Product[] {
    return this.wishlist; // Retourne la référence directe (attention aux modifications externes)
  }

  /**
   * Retirer un produit de la liste de souhaits par son ID
   * @param productId - ID du produit à retirer
   * 
   * @example
   * this.wishlistService.removeFromWishlist('product-123');
   */
  removeFromWishlist(productId: string) {  // <-- on prend l'ID comme paramètre
    // Filtre le tableau pour exclure le produit avec l'ID donné
    this.wishlist = this.wishlist.filter(p => p.id !== productId);
  }
}