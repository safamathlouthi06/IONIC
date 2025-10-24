import { Injectable } from '@angular/core';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private storage = getStorage(); // initialisation du storage Firebase

  /**
   * Upload d'une image et récupération de l'URL
   * @param file File à uploader
   * @param path Chemin dans le storage Firebase (ex: 'products/nom.png')
   */
  async uploadImage(file: File, path: string): Promise<string> {
    const storageRef = ref(this.storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  }

  /** Supprimer une image par son chemin */
  async deleteImage(path: string): Promise<void> {
    try {
      const storageRef = ref(this.storage, path);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Erreur suppression image:', error);
      throw error;
    }
  }
}
