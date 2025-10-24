import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth';

// Interface pour typer les rôles de manière stricte
type UserRole = 'merchant' | 'client';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss']
})
export class RegisterPage {
  // Déclaration du formulaire réactif avec validation
  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]], // Email requis et format valide
    password: ['', [Validators.required, Validators.minLength(8)]], // Mot de passe requis et min 8 caractères
    role: ['', Validators.required], // Rôle obligatoire (merchant ou client)
    terms: [false, Validators.requiredTrue] // Acceptation des CGU obligatoire
  });

  // États du composant
  isLoading: boolean = false; // Indicateur de chargement pendant l'inscription
  errorMessage: string = ''; // Message d'erreur à afficher à l'utilisateur

  // Injection des dépendances
  constructor(
    private fb: FormBuilder, // Service pour construire des formulaires réactifs
    private authService: AuthService, // Service d'authentification personnalisé
    private router: Router // Service de navigation
  ) {}

  // Méthode asynchrone pour gérer l'inscription
  async register() {
    // Arrête l'exécution si le formulaire est invalide
    if (this.registerForm.invalid) return;

    // Début du processus d'inscription
    this.isLoading = true; // Active l'indicateur de chargement
    this.errorMessage = ''; // Réinitialise les messages d'erreur

    try {
      // Récupération des valeurs du formulaire
      const { email, password, role } = this.registerForm.value;
      
      // Vérification de type pour le rôle et existence des valeurs
      if (email && password && role && this.isValidRole(role)) {
        // Appel au service d'authentification pour créer le compte
        await this.authService.register(email, password, role);
        
        // Rediriger selon le rôle après inscription réussie
        const redirectPath = role === 'merchant' 
          ? '/merchant-dashboard'  // Redirection marchand
          : '/client-dashboard';   // Redirection client
        this.router.navigate([redirectPath]);
      } else {
        // Gestion du cas où le rôle n'est pas valide
        this.errorMessage = 'Veuillez sélectionner un type de compte valide';
      }
    } catch (error: any) {
      // Gestion des erreurs d'inscription
      console.error('Erreur d\'inscription:', error);
      
      // Conversion du code d'erreur Firebase en message utilisateur
      this.errorMessage = this.getErrorMessage(error.code);
    } finally {
      // Exécuté dans tous les cas (succès ou erreur)
      this.isLoading = false; // Désactive l'indicateur de chargement
    }
  }

  // Méthode privée pour valider le type de rôle (Type Guard)
  private isValidRole(role: string): role is UserRole {
    return role === 'merchant' || role === 'client';
  }

  // Méthode privée pour mapper les codes d'erreur Firebase en messages français
  private getErrorMessage(errorCode: string): string {
    // Dictionnaire des codes d'erreur Firebase avec leurs messages en français
    const errorMessages: { [key: string]: string } = {
      'auth/email-already-in-use': 'Cette adresse email est déjà utilisée',
      'auth/invalid-email': 'Adresse email invalide',
      'auth/operation-not-allowed': 'Opération non autorisée',
      'auth/weak-password': 'Le mot de passe est trop faible',
      'auth/network-request-failed': 'Erreur de connexion internet'
    };
    
    // Retourne le message correspondant ou un message par défaut
    return errorMessages[errorCode] || 'Une erreur est survenue lors de l\'inscription';
  }
}