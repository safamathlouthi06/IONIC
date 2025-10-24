export interface Product {
  id?: string;       // ID Firestore
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  ownerId: string;   // UID du commerçant
  category: string; 
}
