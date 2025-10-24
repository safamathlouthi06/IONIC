import { Injectable } from '@angular/core';
import { firestore } from '../firebase'; // import depuis firebase.ts
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

export interface Product {
  id?: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  ownerId: string;
  category: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private collectionName = 'products';

  constructor() {}

  // ➕ Ajouter un produit
  async addProduct(product: Product) {
    return addDoc(collection(firestore, this.collectionName), product);
  }

  // 📦 Récupérer tous les produits
  async getProducts(): Promise<Product[]> {
    const q = query(collection(firestore, this.collectionName), orderBy('name'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...(docSnap.data() as Product)
    }));
  }

  // 👤 Récupérer les produits d’un utilisateur spécifique
  async getProductsByUser(userId: string): Promise<Product[]> {
    const q = query(collection(firestore, this.collectionName), where('ownerId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...(docSnap.data() as Product)
    }));
  }

  // 🔍 Récupérer un produit par ID
  async getProductById(id: string): Promise<Product | null> {
    const docRef = doc(firestore, this.collectionName, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...(docSnap.data() as Product) };
    } else {
      return null;
    }
  }

  // ✏️ Mettre à jour un produit
  async updateProduct(product: Product) {
    if (!product.id) throw new Error('Product ID is required');
    const { id, ...data } = product;
    await updateDoc(doc(firestore, this.collectionName, id), data);
  }

  // ❌ Supprimer un produit
  async deleteProduct(productId: string) {
    await deleteDoc(doc(firestore, this.collectionName, productId));
  }

  // Alias pratique
  async removeProduct(productId: string) {
    return this.deleteProduct(productId);
  }
}
