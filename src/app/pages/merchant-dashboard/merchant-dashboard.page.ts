import { Component, OnInit } from '@angular/core';
import { IonicModule, ToastController, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../../services/product';
import { AuthService } from '../../services/auth';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-merchant-dashboard',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './merchant-dashboard.page.html',
  styleUrls: ['./merchant-dashboard.page.scss']
})
export class MerchantDashboardPage implements OnInit {
  // États et données du composant
  products: Product[] = []; // Liste des produits du marchand
  selectedCategory: string = 'All'; // Catégorie sélectionnée pour le filtrage
  categories: string[] = ['Électronique', 'Mode', 'Alimentation', 'Maison', 'Autres']; // Catégories disponibles
  searchTerm: string = ''; // Terme de recherche pour filtrer les produits

  // Gestion de la modale de détail produit
  selectedProduct: Product | null = null;
  showProductModal = false;
  
  // État de chargement
  isLoading: boolean = true;

  // Injection des services
  constructor(
    private productService: ProductService, // Service pour gérer les produits
    private authService: AuthService, // Service d'authentification
    private toastCtrl: ToastController, // Controller pour afficher les toasts
    private router: Router // Service de navigation
  ) {}

  // Méthode du cycle de vie - exécutée à l'initialisation
  async ngOnInit() {
    await this.loadProducts();
  }

  // Méthode du cycle de vie Ionic - exécutée à chaque entrée sur la page
  async ionViewWillEnter() {
    await this.loadProducts();
  }

  // Charge les produits de l'utilisateur connecté
  async loadProducts() {
    this.isLoading = true;
    try {
      // Vérifie que l'utilisateur est connecté
      const user = await this.authService.getCurrentUser();
      if (!user) {
        this.router.navigate(['/login']);
        return;
      }
      // Récupère les produits spécifiques à l'utilisateur
      this.products = await this.productService.getProductsByUser(user.uid);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
      await this.showToast('❌ Erreur lors du chargement des produits', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  // Filtre les produits selon la catégorie et le terme de recherche
  filterProducts() {
    let filtered = this.products;

    // Filtrage par catégorie
    if (this.selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === this.selectedCategory);
    }

    // Filtrage par recherche textuelle
    if (this.searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        p.category?.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    return filtered;
  }

  // Déconnexion de l'utilisateur
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Navigation vers la page d'ajout de produit
  goToAddProduct() {
    this.router.navigate(['/add-product']);
  }

  // Navigation vers la page d'édition d'un produit
  editProduct(product: Product) {
    if (!product.id) return;
    
    this.router.navigate(['/edit-product', product.id]);
  }

  // Suppression d'un produit
  async deleteProduct(product: Product) {
    if (!product.id) return;
    
    try {
      await this.productService.deleteProduct(product.id);
      await this.loadProducts(); // Recharge la liste après suppression
      await this.showToast('✅ Produit supprimé avec succès');
      this.closeModal(); // Ferme la modale si ouverte
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      await this.showToast('❌ Erreur lors de la suppression', 'danger');
    }
  }

  // Confirmation de suppression avec boîte de dialogue
  async confirmDelete(product: Product) {
    const confirmed = confirm(`Êtes-vous sûr de vouloir supprimer "${product.name}" ?`);
    if (confirmed) {
      await this.deleteProduct(product);
    }
  }

  // Affichage du détail produit dans une modale
  viewProduct(product: Product) {
    this.selectedProduct = product;
    this.showProductModal = true;
  }

  // Fermeture de la modale
  closeModal() {
    this.showProductModal = false;
    this.selectedProduct = null;
  }

  // Affichage d'un message toast
  async showToast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }

  // === MÉTHODES UTILITAIRES ===

  // Retourne l'emoji correspondant à une catégorie
  getCategoryEmoji(category: string): string {
    const emojis: { [key: string]: string } = {
      'Électronique': '📱',
      'Mode': '👕',
      'Alimentation': '🍎',
      'Maison': '🏠',
      'Autres': '📦'
    };
    return emojis[category] || '📦';
  }

  // Gestion des erreurs de chargement d'image
  handleImageError(event: any) {
    const imgElement = event.target;
    imgElement.style.display = 'none';
    const overlay = imgElement.nextElementSibling;
    if (overlay && overlay.classList.contains('image-overlay')) {
      overlay.style.display = 'flex';
    }
  }

  // Calcule la valeur totale du stock
  getTotalStockValue(): number {
    return this.products.reduce((total, product) => {
      return total + (product.price || 0);
    }, 0);
  }

  // Compte le nombre de produits filtrés
  getFilteredProductsCount(): number {
    return this.filterProducts().length;
  }

  // Vérifie si des filtres sont actifs
  hasActiveFilters(): boolean {
    return this.selectedCategory !== 'All' || this.searchTerm !== '';
  }

  // Réinitialise tous les filtres
  resetFilters() {
    this.selectedCategory = 'All';
    this.searchTerm = '';
  }

  // Tronque la description si trop longue
  getTruncatedDescription(description: string, maxLength: number = 100): string {
    if (!description) return '';
    return description.length > maxLength 
      ? description.substring(0, maxLength) + '...' 
      : description;
  }

  // Duplique un produit existant
  async duplicateProduct(product: Product) {
    try {
      const duplicatedProduct: Product = {
        ...product, // Copie toutes les propriétés
        id: undefined, // Nouvel ID sera généré
        name: `${product.name} (Copie)` // Modifie le nom pour indiquer la copie
      };

      await this.productService.addProduct(duplicatedProduct);
      await this.loadProducts(); // Recharge la liste
      await this.showToast('✅ Produit dupliqué avec succès');
    } catch (error) {
      console.error('Erreur lors de la duplication:', error);
      await this.showToast('❌ Erreur lors de la duplication', 'danger');
    }
  }
}