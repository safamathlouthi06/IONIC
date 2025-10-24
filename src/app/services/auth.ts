import { Injectable } from '@angular/core';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { Router } from '@angular/router';

export interface User {
  uid: string;
  email: string;
  role: 'client' | 'merchant';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth = getAuth();
  private firestore = getFirestore();

  constructor(private router: Router) {}

  /** Inscription */
  async register(email: string, password: string, role: 'client' | 'merchant'): Promise<void> {
    const credential = await createUserWithEmailAndPassword(this.auth, email, password);

    const user: User = {
      uid: credential.user!.uid,
      email: credential.user!.email!,
      role
    };

    // Enregistrement dans Firestore
    await setDoc(doc(this.firestore, 'users', user.uid), user);

    // Redirection selon le rôle
    if (role === 'client') {
      await this.router.navigate(['/client-dashboard']);
    } else if (role === 'merchant') {
      await this.router.navigate(['/merchant-dashboard']);
    }
  }

  /** Connexion */
  async login(email: string, password: string): Promise<void> {
    const credential = await signInWithEmailAndPassword(this.auth, email, password);

    const docSnap = await getDoc(doc(this.firestore, 'users', credential.user.uid));
    if (!docSnap.exists()) throw new Error('Utilisateur introuvable');

    const user = docSnap.data() as User;

    // Redirection selon le rôle
    if (user.role === 'client') {
      await this.router.navigate(['/client-dashboard']);
    } else if (user.role === 'merchant') {
      await this.router.navigate(['/merchant-dashboard']);
    }
  }

  /** Déconnexion */
  async logout(): Promise<void> {
    await signOut(this.auth);
    await this.router.navigate(['/login']);
  }

  /** Récupérer l'utilisateur connecté */
  async getCurrentUser(): Promise<User | null> {
    const user = this.auth.currentUser;
    if (!user) return null;
    const docSnap = await getDoc(doc(this.firestore, 'users', user.uid));
    return docSnap.exists() ? (docSnap.data() as User) : null;
  }

  /** Vérifier rôle */
  async hasRole(expectedRole: 'client' | 'merchant'): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user?.role === expectedRole;
  }
}
