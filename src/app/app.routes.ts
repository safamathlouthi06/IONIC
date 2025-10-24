import { Routes } from '@angular/router';

import { ProductsPage } from './pages/products/products.page';
import { AddProductPage } from './pages/add-product/add-product.page';
import { RegisterPage } from './pages/register/register.page';
import { LoginPage } from './pages/login/login.page';
import { ClientDashboardPage } from './pages/client-dashboard/client-dashboard.page';
import { MerchantDashboardPage } from './pages/merchant-dashboard/merchant-dashboard.page';
import { ProfilePage } from './pages/profile/profile.page';
import { CartPage } from './pages/cart/cart.page';
import { WishlistPage } from './pages/wishlist/wishlist.page';
import { EditProductPage } from './pages/edit-product/edit-product.page';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'products', component: ProductsPage },
  { path: 'add-product', component: AddProductPage },
  { path: 'register', component: RegisterPage },
  { path: 'login', component: LoginPage },
  {path: 'client-dashboard', component: ClientDashboardPage},
  { path: 'merchant-dashboard',component: MerchantDashboardPage},
  {path: 'profile', component:ProfilePage},
  {path: 'cart', component:CartPage},
  {path: 'wishlist',component : WishlistPage},
   { path: 'edit-product/:id', component: EditProductPage },
 
];
