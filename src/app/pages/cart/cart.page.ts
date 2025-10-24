import { Component } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Service pour naviguer entre les pages
import { CartService } from '../../services/cart';
import { Product } from '../../services/product';

// Cette page affiche le panier d'achat du client et permet de passer commande
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss']
})
export class CartPage {
  cart: Product[] = []; // Liste des produits dans le panier

  // Injection des services nécessaires :
  // - cartService : pour gérer le panier (ajouter, supprimer, vider)
  // - toastCtrl : pour afficher des messages de confirmation
  // - router : pour changer de page (aller vers les produits ou autre)
  constructor(
    private cartService: CartService, 
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  // Cette méthode est appelée automatiquement quand la page devient visible
  ionViewWillEnter() {
    this.loadCart();
  }

  // Charge les produits du panier depuis le service
  loadCart() {
    this.cart = this.cartService.getCart();
  }

  // Calcule le prix total de tous les articles dans le panier
  getSubtotal(): number {
    if (!this.cart || this.cart.length === 0) {
      return 0; // Panier vide = total à 0
    }
    
    // Additionne le prix de chaque produit
    return this.cart.reduce((total, product) => {
      return total + (product.price || 0);
    }, 0);
  }

  // Compte le nombre d'articles dans le panier
  getTotalItems(): number {
    return this.cart.length;
  }

  // Vide complètement le panier
  async clearCart() {
    this.cartService.clearCart();
    this.loadCart(); // Recharge le panier (qui sera vide)
    await this.showToast('Panier vidé', 'warning');
  }

  // Retire un produit spécifique du panier
  async removeItem(product: Product) {
    if (!product.id) {
      console.error('Impossible de retirer le produit : ID manquant');
      await this.showToast('Erreur lors de la suppression', 'danger');
      return;
    }
    
    this.cartService.removeFromCart(product.id);
    this.loadCart(); // Recharge le panier mis à jour
    await this.showToast('Produit retiré du panier', 'danger');
  }

  // Passe la commande (valide l'achat)
  async checkout() {
    // Vérifie que le panier n'est pas vide
    if (this.cart.length === 0) {
      await this.showToast('Le panier est vide', 'warning');
      return;
    }

    try {
      // Vérifie que tous les produits ont un prix valide
      const invalidProducts = this.cart.filter(product => !product.price || product.price <= 0);
      if (invalidProducts.length > 0) {
        await this.showToast('Certains produits ont un prix invalide', 'warning');
        return;
      }

      // Enregistre la commande dans le système
      await this.cartService.placeOrder();
      this.loadCart(); // Recharge le panier (normalement vide après commande)
      await this.showToast('✅ Commande passée avec succès !', 'success');
      
    } catch (error) {
      console.error('Erreur lors du checkout:', error);
      await this.showToast('❌ Erreur lors de la commande', 'danger');
    }
  }

  // Calcule les frais de livraison
  getShippingCost(): number {
    if (this.getSubtotal() === 0) {
      return 0; // Pas de frais si panier vide
    }
    // Livraison gratuite à partir de 50€ d'achat, sinon 4.99€
    return this.getSubtotal() >= 50 ? 0 : 4.99;
  }

  // Calcule le total général (articles + livraison)
  getTotal(): number {
    return this.getSubtotal() + this.getShippingCost();
  }

  // Formate un prix pour l'affichage (ex: 25.50 → "25,50 €")
  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  }

  // Vérifie si le panier peut être commandé
  // (doit contenir des articles et avoir un total positif)
  canCheckout(): boolean {
    return this.cart.length > 0 && this.getSubtotal() > 0;
  }

  // Récupère toutes les infos de la commande pour l'affichage
  getOrderSummary() {
    return {
      subtotal: this.getSubtotal(),   // Total des articles
      shipping: this.getShippingCost(), // Frais de livraison
      total: this.getTotal(),         // Total général
      items: this.getTotalItems()     // Nombre d'articles
    };
  }

  // Affiche un message temporaire en bas de l'écran
  async showToast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,  // Message visible pendant 2 secondes
      color,           // Couleur selon le type de message
      position: 'bottom'
    });
    await toast.present();
  }

  // Redirige vers la page des produits pour continuer les achats
  continueShopping() {
    this.router.navigate(['/products']);
  }
}