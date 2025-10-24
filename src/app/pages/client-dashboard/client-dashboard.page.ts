import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

// Décorateur Component qui définit les métadonnées du composant
@Component({
  selector: 'app-client-dashboard', // Le sélecteur HTML pour utiliser ce composant
  standalone: true, // Indique que c'est un composant autonome (Angular 14+)
  imports: [IonicModule, CommonModule, RouterModule], // Modules nécessaires pour ce composant
  templateUrl: './client-dashboard.page.html', // Template HTML associé
  styleUrls: ['./client-dashboard.page.scss'] // Feuilles de style SCSS associées
})
export class ClientDashboardPage {

  // Déclaration des icônes utilisées dans le template sous forme d'objet
  // Cela permet de centraliser et de maintenir facilement les noms d'icônes
  icons = {
    notifications: 'notifications-outline', // Icône pour les notifications
    personCircle: 'person-circle-outline', // Icône de profil utilisateur
    time: 'time-outline', // Icône horloge/temps
    storefront: 'storefront-outline', // Icône boutique/magasin
    cart: 'cart-outline', // Icône panier d'achat
    heart: 'heart-outline', // Icône favoris/coeur
    person: 'person-outline', // Icône personne/profil
    logOut: 'log-out-outline', // Icône déconnexion
    arrowForward: 'arrow-forward' // Icône flèche vers l'avant
  };

  // Injection des dépendances dans le constructeur
  constructor(private router: Router, private authService: AuthService) {}

  // Méthode pour naviguer vers la page des produits
  goToProducts() { 
    this.router.navigate(['/products']); 
  }

  // Méthode pour naviguer vers la page de profil utilisateur
  goToProfile() { 
    this.router.navigate(['/profile']); 
  }

  // Méthode pour naviguer vers la page du panier d'achat
  goToCart() { 
    this.router.navigate(['/cart']); 
  }

  // Méthode pour naviguer vers la page des favoris
  goToWishlist() { 
    this.router.navigate(['/wishlist']); 
  }

  // Méthode asynchrone pour gérer la déconnexion de l'utilisateur
  async logout() {
    // Appel du service d'authentification pour déconnecter l'utilisateur
    await this.authService.logout();
    // Redirection vers la page de connexion après la déconnexion
    this.router.navigate(['/login']);
  }
}