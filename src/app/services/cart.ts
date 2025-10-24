import { Injectable } from '@angular/core';
import { Product } from './product';

// Interface définissant une commande
interface Order {
  id: string; // Identifiant unique de la commande
  products: Product[]; // Liste des produits commandés
  date: string; // Date de la commande au format ISO
}

// Interface définissant une vente individuelle
interface Sale {
  product: Product; // Produit vendu
  date: string; // Date de la vente au format ISO
}

@Injectable({ providedIn: 'root' }) // Service disponible globalement (singleton)
export class CartService {
  // États internes du service
  private cart: Product[] = []; // Panier actuel de l'utilisateur
  private orders: Order[] = []; // Historique des commandes passées
  private sales: Sale[] = []; // Historique détaillé de toutes les ventes

  /**
   * Ajouter un produit au panier
   * @param product - Produit à ajouter
   */
  addToCart(product: Product): void {
    if (!product) return; // Validation basique
    this.cart.push(product);
  }

  /**
   * Récupérer le panier actuel
   * @returns Copie du panier pour éviter les modifications directes
   */
  getCart(): Product[] {
    return [...this.cart]; // Retourne une copie pour éviter modification externe
  }

  /**
   * Retirer un produit du panier par son ID
   * @param productId - ID du produit à retirer
   */
  removeFromCart(productId: string): void {
    if (!productId) return;
    this.cart = this.cart.filter(p => p.id !== productId);
  }

  /**
   * Vider complètement le panier
   */
  clearCart(): void {
    this.cart = [];
  }

  /**
   * Valider la commande et transférer le panier vers l'historique
   * @returns Promise<void>
   */
  async placeOrder(): Promise<void> {
    if (this.cart.length === 0) return; // Panier vide

    const now = new Date().toISOString(); // Timestamp actuel

    // 1. Ajouter chaque produit aux ventes individuelles
    this.cart.forEach(p => this.sales.push({ product: p, date: now }));

    // 2. Créer une nouvelle commande dans l'historique
    this.orders.push({
      id: now + '_' + Math.floor(Math.random() * 1000), // ID unique basé sur timestamp + random
      products: [...this.cart], // Copie des produits du panier
      date: now
    });

    // 3. Vider le panier après commande
    this.clearCart();
  }

  /**
   * Récupérer l'historique des commandes
   * @returns Copie de l'historique des commandes
   */
  getOrders(): Order[] {
    return [...this.orders]; // copie pour sécurité
  }

  /**
   * Récupérer l'historique détaillé de toutes les ventes
   * @returns Copie de l'historique des ventes
   */
  getSales(): Sale[] {
    return [...this.sales];
  }

  /**
   * Récupérer les ventes depuis la dernière vérification
   * Utile pour les notifications ou mises à jour en temps réel
   * @param lastCheck - Date ISO de la dernière vérification
   * @returns Ventes postérieures à la date donnée
   */
  getNewSales(lastCheck: string): Sale[] {
    if (!lastCheck) return [...this.sales]; // Si pas de date, retourne tout
    return this.sales.filter(s => s.date > lastCheck);
  }
}