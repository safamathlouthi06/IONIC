import { Injectable } from '@angular/core';
import { firestore } from '../firebase'; // Configuration Firebase initialisée
import {
  collection,
  addDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  updateDoc,
  deleteDoc,
  orderBy
} from 'firebase/firestore';

// Interface définissant la structure d'un produit
export interface Product {
  id?: string; // Optionnel car généré par Firestore
  name: string; // Nom du produit (obligatoire)
  price: number; // Prix du produit (obligatoire)
  description?: string; // Description optionnelle
  imageUrl?: string; // URL de l'image optionnelle
  ownerId: string; // ID du propriétaire/vendeur (obligatoire)
  category: string; // Catégorie du produit (obligatoire)
}

@Injectable({
  providedIn: 'root' // Service disponible globalement
})
export class ProductService {
  private collectionName = 'products'; // Nom de la collection Firestore

  constructor() {}

  // ➕ Ajouter un nouveau produit
  async addProduct(product: Product) {
    // addDoc génère automatiquement un ID unique
    return addDoc(collection(firestore, this.collectionName), product);
  }

  // 📦 Récupérer tous les produits (triés par nom)
  async getProducts(): Promise<Product[]> {
    // Création d'une requête avec tri par nom
    const q = query(collection(firestore, this.collectionName), orderBy('name'));
    const snapshot = await getDocs(q);
    
    // Transformation des documents Firestore en objets Product
    return snapshot.docs.map(docSnap => ({
      id: docSnap.id, // ID du document Firestore
      ...(docSnap.data() as Product) // Données du produit
    }));
  }

  // 👤 Récupérer les produits d'un utilisateur spécifique
  async getProductsByUser(userId: string): Promise<Product[]> {
    try {
      // Requête optimisée avec filtre Firestore
      const q = query(
        collection(firestore, this.collectionName), 
        where('ownerId', '==', userId) // Filtre côté serveur
      );
      const snapshot = await getDocs(q);
      const products = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...(docSnap.data() as Product)
      }));
      
      return products;
      
    } catch (error: any) {
      // Fallback en cas d'index manquant dans Firestore
      if (error.code === 'failed-precondition') {
        console.warn('Index missing, using client-side filtering');
        // Récupère tous les produits et filtre côté client
        const allProducts = await this.getProducts();
        return allProducts.filter(product => product.ownerId === userId);
      }
      throw error; // Propage les autres erreurs
    }
  }

  // 🔍 Récupérer un produit spécifique par son ID
  async getProductById(id: string): Promise<Product | null> {
    const docRef = doc(firestore, this.collectionName, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { 
        id: docSnap.id, 
        ...(docSnap.data() as Product) 
      };
    } else {
      return null; // Produit non trouvé
    }
  }

  // ✏️ Mettre à jour un produit existant
  async updateProduct(product: Product) {
    if (!product.id) throw new Error('Product ID is required');
    
    // Séparation de l'ID des données à mettre à jour
    const { id, ...data } = product;
    await updateDoc(doc(firestore, this.collectionName, id), data);
  }

  // ❌ Supprimer un produit
  async deleteProduct(productId: string) {
    await deleteDoc(doc(firestore, this.collectionName, productId));
  }

  // Alias pratique pour la suppression
  async removeProduct(productId: string) {
    return this.deleteProduct(productId);
  }
}