import { Component, OnInit } from '@angular/core';
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
export class ProductsPage implements OnInit {
  // États du composant
  selectedCategory: string = 'All'; // Catégorie sélectionnée pour le filtrage
  categories: string[] = ['Électronique', 'Mode', 'Beauté', 'Maison', 'Sport']; // Catégories disponibles
  products: Product[] = []; // Liste complète des produits
  isLoading: boolean = true; // Indicateur de chargement

  // Injection des services
  constructor(
    private productService: ProductService, // Service pour gérer les produits
    private wishlistService: WishlistService, // Service pour la liste de souhaits
    private cartService: CartService, // Service pour le panier d'achat
    private toastCtrl: ToastController // Controller pour afficher les notifications
  ) {}

  // Méthode du cycle de vie Angular - exécutée à l'initialisation
  async ngOnInit() {
    await this.loadProducts();
  }

  // Méthode du cycle de vie Ionic - exécutée à chaque entrée sur la page
  async ionViewWillEnter() {
    // Recharger les produits à chaque affichage de la page
    // Permet d'avoir les données à jour si modifications ailleurs
    await this.loadProducts();
  }

  // Charge tous les produits depuis l'API/service
  async loadProducts() {
    this.isLoading = true; // Active l'indicateur de chargement
    try {
      // Récupère tous les produits disponibles
      this.products = await this.productService.getProducts();
    } catch (error) {
      // Gestion des erreurs de chargement
      console.error('Erreur lors du chargement des produits :', error);
      this.showToast('❌ Impossible de charger les produits', 'danger');
    } finally {
      // Désactive l'indicateur de chargement dans tous les cas
      this.isLoading = false;
    }
  }

  // Filtre les produits selon la catégorie sélectionnée
  filterProducts(): Product[] {
    return this.selectedCategory === 'All'
      ? this.products // Retourne tous les produits si "All" est sélectionné
      : this.products.filter(p => p.category === this.selectedCategory); // Filtre par catégorie
  }

  // Ajoute un produit au panier d'achat
  async addToCart(product: Product) {
    try {
      // Utilise le service cart pour ajouter le produit
      await this.cartService.addToCart(product);
      // Feedback visuel à l'utilisateur
      this.showToast('✅ Produit ajouté au panier !', 'success');
    } catch (error) {
      // Gestion des erreurs d'ajout au panier
      console.error('Erreur ajout panier :', error);
      this.showToast('❌ Erreur lors de l\'ajout au panier', 'danger');
    }
  }

  // Ajoute un produit à la liste de souhaits
  async addToWishlist(product: Product) {
    try {
      // Utilise le service wishlist pour ajouter le produit
      await this.wishlistService.addToWishlist(product);
      // Feedback visuel avec emoji pour plus d'engagement
      this.showToast('💝 Produit ajouté à la wishlist !', 'success');
    } catch (error) {
      // Gestion des erreurs d'ajout à la wishlist
      console.error('Erreur ajout wishlist :', error);
      this.showToast('❌ Erreur lors de l\'ajout à la wishlist', 'danger');
    }
  }

  // Affiche une notification toast à l'utilisateur
  async showToast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 1500, // Durée d'affichage courte pour ne pas gêner
      color, // Couleur selon le type de message
      position: 'top' // Position en haut de l'écran
    });
    await toast.present();
  }

  // Retourne l'emoji correspondant à une catégorie pour l'affichage visuel
  getCategoryEmoji(category: string): string {
    const emojis: { [key: string]: string } = {
      'Électronique': '📱',
      'Mode': '👕',
      'Beauté': '💄',
      'Maison': '🏠',
      'Sport': '⚽',
      'Alimentation': '🍎', // Catégorie définie mais pas dans la liste initiale
      'Autres': '📦' // Catégorie par défaut
    };
    return emojis[category] || '📦'; // Retourne l'emoji ou 📦 par défaut
  }

  // Gère les erreurs de chargement d'image
  handleImageError(event: any) {
    // Remplace l'image cassée par une image de placeholder
    event.target.src = 'assets/images/placeholder.jpg';
  }
}