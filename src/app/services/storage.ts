import { Injectable } from '@angular/core';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

@Injectable({
  providedIn: 'root' // Service disponible globalement dans l'application
})
export class StorageService {

  // Initialisation du service Firebase Storage
  private storage = getStorage();

  /**
   * Upload d'une image et récupération de l'URL publique
   * @param file - Fichier image à uploader (File object)
   * @param path - Chemin de stockage dans Firebase (ex: 'products/nom.png', 'users/avatar.jpg')
   * @returns Promise<string> - URL publique de téléchargement
   * 
   * @example
   * const url = await storageService.uploadImage(file, 'products/phone-case.jpg');
   */
  async uploadImage(file: File, path: string): Promise<string> {
    // 1. Création d'une référence vers l'emplacement de stockage
    const storageRef = ref(this.storage, path);
    
    // 2. Upload du fichier vers Firebase Storage
    await uploadBytes(storageRef, file);
    
    // 3. Récupération de l'URL publique pour l'affichage/partage
    return await getDownloadURL(storageRef);
  }

  /** 
   * Supprimer une image du stockage Firebase
   * @param path - Chemin complet de l'image à supprimer
   * @returns Promise<void>
   * @throws Error si la suppression échoue
   * 
   * @example
   * await storageService.deleteImage('products/old-product.jpg');
   */
  async deleteImage(path: string): Promise<void> {
    try {
      // 1. Création d'une référence vers le fichier à supprimer
      const storageRef = ref(this.storage, path);
      
      // 2. Suppression du fichier
      await deleteObject(storageRef);
    } catch (error) {
      // 3. Gestion et log des erreurs
      console.error('Erreur suppression image:', error);
      throw error; // Propagation de l'erreur pour gestion externe
    }
  }
}