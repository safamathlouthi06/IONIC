import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService, User } from '../../services/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user: User | null = null;
  isLoading = true;

  constructor(private authService: AuthService, private router: Router) {}

  async ngOnInit() {
    this.user = await this.authService.getCurrentUser();
    this.isLoading = false;
  }

  goToDashboard() {
    if (this.user?.role === 'client') {
      this.router.navigate(['/client-dashboard']);
    } else if (this.user?.role === 'merchant') {
      this.router.navigate(['/merchant-dashboard']);
    } 
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
