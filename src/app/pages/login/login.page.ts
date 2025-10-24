import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth';

// Décorateur Component définissant les métadonnées du composant
@Component({
  selector: 'app-login', // Sélecteur HTML pour ce composant
  standalone: true, // Composant autonome (Angular 14+)
  imports: [
    IonicModule, // Module Ionic pour les composants UI
    CommonModule, // Module Angular commun (ngIf, ngFor, etc.)
    ReactiveFormsModule, // Module pour les formulaires réactifs
    RouterModule // Module pour la navigation et routerLink
  ],
  templateUrl: './login.page.html', // Template HTML associé
  styleUrls: ['./login.page.scss'] // Feuilles de style SCSS
})
export class LoginPage {
  // Déclaration du formulaire réactif avec validation
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]], // Champ email avec validation
    password: ['', [Validators.required, Validators.minLength(6)]] // Champ mot de passe avec validation
  });

  // États du composant
  isLoading: boolean = false; // Indicateur de chargement pendant la connexion
  errorMessage: string = ''; // Message d'erreur à afficher à l'utilisateur

  // Injection des dépendances
  constructor(
    private fb: FormBuilder, // Service pour construire des formulaires réactifs
    private authService: AuthService, // Service d'authentification personnalisé
    private router: Router // Service de navigation
  ) {}

  // Méthode asynchrone pour gérer la connexion
  async login() {
    // Vérifie si le formulaire est invalide et arrête l'exécution si c'est le cas
    if (this.loginForm.invalid) return;

    // Début du processus de connexion
    this.isLoading = true; // Active l'indicateur de chargement
    this.errorMessage = ''; // Réinitialise les messages d'erreur

    try {
      // Récupération des valeurs du formulaire
      const { email, password } = this.loginForm.value;
      
      // Vérification que les valeurs existent (TypeScript safety)
      if (email && password) {
        // Appel au service d'authentification pour la connexion
        await this.authService.login(email, password);
        
        // Redirection vers le tableau de bord après connexion réussie
        this.router.navigate(['/merchant-dashboard']);
      }
    } catch (error: any) {
      // Gestion des erreurs de connexion
      console.error('Erreur de connexion:', error);
      
      // Conversion du code d'erreur Firebase en message utilisateur
      this.errorMessage = this.getErrorMessage(error.code);
    } finally {
      // Exécuté dans tous les cas (succès ou erreur)
      this.isLoading = false; // Désactive l'indicateur de chargement
    }
  }

  // Méthode privée pour mapper les codes d'erreur Firebase en messages français
  private getErrorMessage(errorCode: string): string {
    // Dictionnaire des codes d'erreur Firebase avec leurs messages en français
    const errorMessages: { [key: string]: string } = {
      'auth/invalid-email': 'Adresse email invalide',
      'auth/user-disabled': 'Ce compte a été désactivé',
      'auth/user-not-found': 'Aucun compte trouvé avec cet email',
      'auth/wrong-password': 'Mot de passe incorrect',
      'auth/too-many-requests': 'Trop de tentatives. Réessayez plus tard',
      'auth/network-request-failed': 'Erreur de connexion internet'
    };
    
    // Retourne le message correspondant ou un message par défaut
    return errorMessages[errorCode] || 'Une erreur est survenue lors de la connexion';
  }
}