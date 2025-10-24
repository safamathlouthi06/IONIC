export interface User {
  uid: string;
  email: string;
  role: 'client' | 'merchant'; // rôle utilisateur
  displayName?: string;
}
