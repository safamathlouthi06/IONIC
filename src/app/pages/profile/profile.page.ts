import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService, User } from '../../services/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  // États du composant
  user: User | null = null; // Informations de l'utilisateur connecté
  isLoading = true; // Indicateur de chargement des données utilisateur

  // Injection des services
  constructor(
    private authService: AuthService, // Service d'authentification pour récupérer les infos utilisateur
    private router: Router // Service de navigation pour les redirections
  ) {}

  // Méthode du cycle de vie Angular - exécutée à l'initialisation du composant
  async ngOnInit() {
    // Récupère l'utilisateur actuellement connecté
    this.user = await this.authService.getCurrentUser();
    // Désactive l'indicateur de chargement une fois les données récupérées
    this.isLoading = false;
  }

  // Redirige vers le tableau de bord approprié selon le rôle de l'utilisateur
  goToDashboard() {
    if (this.user?.role === 'client') {
      // Si l'utilisateur est un client, redirection vers le dashboard client
      this.router.navigate(['/client-dashboard']);
    } else if (this.user?.role === 'merchant') {
      // Si l'utilisateur est un marchand, redirection vers le dashboard marchand
      this.router.navigate(['/merchant-dashboard']);
    } 
    // Note: Pas de else, donc si le rôle est undefined ou autre, aucune action
  }

  // Déconnecte l'utilisateur et redirige vers la page de connexion
  async logout() {
    // Appel au service d'authentification pour effectuer la déconnexion
    await this.authService.logout();
    // Redirection vers la page de connexion après déconnexion réussie
    this.router.navigate(['/login']);
  }
}