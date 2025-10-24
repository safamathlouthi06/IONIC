import { Injectable } from '@angular/core';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { Router } from '@angular/router';

// Interface définissant la structure d'un utilisateur dans l'application
export interface User {
  uid: string; // Identifiant unique Firebase
  email: string; // Adresse email de l'utilisateur
  role: 'client' | 'merchant'; // Rôle dans l'application (système de permissions)
}

@Injectable({
  providedIn: 'root' // Service disponible dans toute l'application (singleton)
})
export class AuthService {

  // Initialisation des services Firebase
  private auth = getAuth(); // Service d'authentification Firebase
  private firestore = getFirestore(); // Base de données Firestore

  // Injection du router pour la navigation
  constructor(private router: Router) {}

  /** 
   * Inscription d'un nouvel utilisateur
   * @param email - Email de l'utilisateur
   * @param password - Mot de passe
   * @param role - Rôle (client ou merchant)
   * @returns Promise<void>
   */
  async register(email: string, password: string, role: 'client' | 'merchant'): Promise<void> {
    // 1. Création du compte dans Firebase Authentication
    const credential = await createUserWithEmailAndPassword(this.auth, email, password);

    // 2. Construction de l'objet utilisateur avec le rôle
    const user: User = {
      uid: credential.user!.uid, // UID généré par Firebase
      email: credential.user!.email!, // Email vérifié
      role // Rôle spécifique à l'application
    };

    // 3. Enregistrement des données supplémentaires dans Firestore
    // Crée un document dans la collection 'users' avec l'UID comme ID
    await setDoc(doc(this.firestore, 'users', user.uid), user);

    // 4. Redirection automatique selon le rôle
    if (role === 'client') {
      await this.router.navigate(['/client-dashboard']);
    } else if (role === 'merchant') {
      await this.router.navigate(['/merchant-dashboard']);
    }
  }

  /** 
   * Connexion d'un utilisateur existant
   * @param email - Email de l'utilisateur
   * @param password - Mot de passe
   * @returns Promise<void>
   */
  async login(email: string, password: string): Promise<void> {
    // 1. Authentification avec Firebase Auth
    const credential = await signInWithEmailAndPassword(this.auth, email, password);

    // 2. Récupération des données utilisateur depuis Firestore
    const docSnap = await getDoc(doc(this.firestore, 'users', credential.user.uid));
    
    // 3. Vérification que l'utilisateur existe dans Firestore
    if (!docSnap.exists()) throw new Error('Utilisateur introuvable');

    // 4. Conversion des données Firestore en objet User
    const user = docSnap.data() as User;

    // 5. Redirection selon le rôle stocké en base
    if (user.role === 'client') {
      await this.router.navigate(['/client-dashboard']);
    } else if (user.role === 'merchant') {
      await this.router.navigate(['/merchant-dashboard']);
    }
  }

  /** 
   * Déconnexion de l'utilisateur
   * @returns Promise<void>
   */
  async logout(): Promise<void> {
    // 1. Déconnexion de Firebase Authentication
    await signOut(this.auth);
    
    // 2. Redirection vers la page de login
    await this.router.navigate(['/login']);
  }

  /** 
   * Récupérer l'utilisateur actuellement connecté avec ses données complètes
   * @returns Promise<User | null> - Utilisateur ou null si non connecté
   */
  async getCurrentUser(): Promise<User | null> {
    // 1. Vérification de l'état d'authentification Firebase
    const user = this.auth.currentUser;
    if (!user) return null; // Aucun utilisateur connecté
    
    // 2. Récupération des données supplémentaires depuis Firestore
    const docSnap = await getDoc(doc(this.firestore, 'users', user.uid));
    
    // 3. Retourne les données si elles existent
    return docSnap.exists() ? (docSnap.data() as User) : null;
  }

  /** 
   * Vérifier si l'utilisateur connecté a un rôle spécifique
   * @param expectedRole - Rôle à vérifier
   * @returns Promise<boolean> - True si l'utilisateur a le rôle
   */
  async hasRole(expectedRole: 'client' | 'merchant'): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user?.role === expectedRole;
  }
}