import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss']
})
export class RegisterPage {
  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['client', Validators.required] // choix entre client ou merchant
  });

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  async register() {
    if (this.registerForm.valid) {
      const { email, password, role } = this.registerForm.value;
      try {
        await this.authService.register(
          email!,
          password!,
          role as 'client' | 'merchant'
        );
      } catch (error: any) {
        alert(error.message);
      }
    }
  }
}

