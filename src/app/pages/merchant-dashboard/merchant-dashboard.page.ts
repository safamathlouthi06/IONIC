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
  products: Product[] = [];
  selectedCategory: string = 'All';
  categories: string[] = ['Electronique', 'Mode', 'Maison', 'Autres'];
  searchTerm: string = '';

  selectedProduct: Product | null = null;
  showProductModal = false;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  async loadProducts() {
    const user = await this.authService.getCurrentUser();
    if (!user) return;
    this.products = await this.productService.getProductsByUser(user.uid);
  }

  filterProducts() {
    let filtered = this.products;

    if (this.selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === this.selectedCategory);
    }

    if (this.searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    return filtered;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToAddProduct() {
    this.router.navigate(['/add-product']);
  }

  editProduct(product: Product) {
    if (!product.id) return;
    this.router.navigate(['/edit-product', product.id]);
  }

  async deleteProduct(product: Product) {
    if (!product.id) return;
    await this.productService.deleteProduct(product.id);
    this.loadProducts();
    this.showToast('Produit supprimé avec succès');
  }

  viewProduct(product: Product) {
    this.selectedProduct = product;
    this.showProductModal = true;
  }

  closeModal() {
    this.showProductModal = false;
    this.selectedProduct = null;
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 1500,
      color: 'success'
    });
    toast.present();
  }

  // AJOUTEZ CES MÉTHODES MANQUANTES :

  /**
   * Retourne l'icône correspondant à une catégorie
   */
  getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      'Electronique': 'hardware-chip-outline',
      'Mode': 'shirt-outline',
      'Maison': 'home-outline',
      'Autres': 'cube-outline',
      'All': 'apps-outline'
    };
    return icons[category] || 'cube-outline';
  }

  /**
   * Gère les erreurs de chargement d'image
   */
  handleImageError(event: any) {
    const imgElement = event.target;
    imgElement.style.display = 'none';
    
    // Affiche l'overlay d'image manquante
    const overlay = imgElement.nextElementSibling;
    if (overlay && overlay.classList.contains('image-overlay')) {
      overlay.style.display = 'flex';
    }
  }

  /**
   * Formate la date pour l'affichage
   */
  formatDate(dateString: string): string {
    if (!dateString) return 'Date inconnue';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return 'Date invalide';
    }
  }

  /**
   * Vérifie si un produit est récent (moins de 7 jours)
   */


  /**
   * Retourne la couleur du badge selon la catégorie
   */
  getCategoryColor(category: string): string {
    const colors: { [key: string]: string } = {
      'Electronique': 'primary',
      'Mode': 'secondary', 
      'Maison': 'tertiary',
      'Autres': 'success'
    };
    return colors[category] || 'medium';
  }

  /**
   * Calcule le nombre total de produits
   */
  getTotalProducts(): number {
    return this.products.length;
  }

  /**
   * Calcule la valeur totale du stock
   */

  /**
   * Réinitialise les filtres
   */
  resetFilters() {
    this.selectedCategory = 'All';
    this.searchTerm = '';
  }

  /**
   * Vérifie si des filtres sont actifs
   */
  hasActiveFilters(): boolean {
    return this.selectedCategory !== 'All' || this.searchTerm !== '';
  }
}