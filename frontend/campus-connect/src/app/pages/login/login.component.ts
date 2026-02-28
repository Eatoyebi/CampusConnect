import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  // Form fields
  email: string = '';
  password: string = '';
  universityId: string = localStorage.getItem('cc_universityId') || 'UC';

  // UI state
  loading: boolean = false;
  errorMessage: string = '';
  showPassword: boolean = false; 

  onSubmit(): void {
    if (this.loading) return;

    this.errorMessage = '';

    if (!this.email.trim() || !this.password.trim()) {
      this.errorMessage = 'Please enter your email and password.';
      return;
    }

    this.loading = true;

    localStorage.setItem('cc_universityId', this.universityId);

    this.auth.login({
      email: this.email.trim(),
      password: this.password,
      universityId: this.universityId.trim(),
    }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigateByUrl('/');  
      },
      error: (err) => {
        this.loading = false;

        if (err?.status === 401) {
          this.errorMessage = 'Invalid email or password.';
        } else if (err?.status === 400) {
          this.errorMessage = 'Missing required fields.';
        } else {
          this.errorMessage = 'Unable to sign in. Please try again.';
        }
      }
    });
  }
}