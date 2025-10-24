import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { environment } from '../environments/environment';

// ✅ Initialisation unique de Firebase avec la config importée
// Crée l'instance principale de l'application Firebase
const app = initializeApp(environment.firebaseConfig);

// 🔥 Initialisation des services Firebase individuels

// Base de données Firestore (NoSQL)
// Utilisé pour stocker les produits, utilisateurs, commandes, etc.
export const firestore = getFirestore(app);

// Service d'authentification
// Gère l'inscription, connexion, déconnexion des utilisateurs
export const auth = getAuth(app);

// Stockage de fichiers (images, documents)
// Utilisé pour les images de produits, avatars, etc.
export const storage = getStorage(app);

// Analytics pour le tracking d'usage
// Collecte des données d'utilisation de l'application
export const analytics = getAnalytics(app);