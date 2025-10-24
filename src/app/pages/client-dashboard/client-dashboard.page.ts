import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';


@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
  templateUrl: './client-dashboard.page.html',
  styleUrls: ['./client-dashboard.page.scss']
})
export class ClientDashboardPage {

  constructor(private router: Router, private authService: AuthService) {}

  goToProducts() {
    this.router.navigate(['/products']);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

    goToCart() {
    this.router.navigate(['/cart']);
  }

  goToWishlist() {
    this.router.navigate(['/wishlist']);
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
  
}
