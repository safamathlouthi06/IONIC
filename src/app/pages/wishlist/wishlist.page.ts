import { Component } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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
  // Liste des produits dans la wishlist
  wishlist: Product[] = [];

  // Injection des services nécessaires
  constructor(
    private wishlistService: WishlistService, // Service pour gérer la liste de souhaits
    private cartService: CartService, // Service pour gérer le panier
    private toastCtrl: ToastController, // Controller pour afficher les notifications
    private router: Router // Service de navigation
  ) {}

  // Méthode du cycle de vie Ionic - exécutée à chaque entrée sur la page
  ionViewWillEnter() {
    this.loadWishlist(); // Recharge la wishlist à chaque affichage
  }

  // Charge la liste des produits de la wishlist
  loadWishlist() {
    this.wishlist = this.wishlistService.getWishlist();
  }

  // Supprime un produit de la wishlist
  async removeItem(product: Product) {
    // Vérification de sécurité : s'assurer que le produit a un ID
    if (!product.id) {
      console.error('Impossible de retirer le produit : ID manquant');
      await this.showToast('Erreur lors de la suppression', 'danger');
      return;
    }
    
    // Supprime le produit de la wishlist via le service
    this.wishlistService.removeFromWishlist(product.id);
    
    // Recharge la liste mise à jour
    this.loadWishlist();
    
    // Affiche un message de confirmation
    await this.showToast('Produit retiré des favoris', 'danger'); // 'danger' pour indiquer une suppression
  }

  // Ajoute un produit au panier et le retire automatiquement de la wishlist
  async addToCart(product: Product) {
    try {
      // 1️⃣ Ajouter au panier
      this.cartService.addToCart(product);

      // 2️⃣ Supprimer automatiquement de la wishlist
      // (Logique métier : quand on ajoute au panier, on le retire des favoris)
      if (product.id) {
        this.wishlistService.removeFromWishlist(product.id);
      }

      // 3️⃣ Recharger la liste mise à jour
      this.loadWishlist();

      // 4️⃣ Afficher le message de succès
      await this.showToast('✅ Produit ajouté au panier', 'success');
      
    } catch (error) {
      // Gestion des erreurs lors de l'ajout au panier
      console.error('Erreur lors de l\'ajout au panier:', error);
      await this.showToast('❌ Erreur lors de l\'ajout au panier', 'danger');
    }
  }

  // Navigation vers la page des produits pour continuer les achats
  continueShopping() {
    this.router.navigate(['/products']);
  }

  // Affiche une notification toast à l'utilisateur
  async showToast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000, // Durée d'affichage de 2 secondes
      color, // Couleur selon le type de message
      position: 'bottom' // Position en bas de l'écran
    });
    await toast.present();
  }
}