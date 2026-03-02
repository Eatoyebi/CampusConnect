import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router,RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService, Role } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);

  user$ = this.auth.user$;

ngOnInit(): void {
    this.auth.bootstrap().subscribe({
      next: () => {},
      error: () => {
    
      }
    });
  }
 

   get role(): Role | null {
    return this.auth.getUserSnapshot()?.role ?? null;
  }


   isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }
  canSeeAnnouncements(): boolean {
    return this.role === 'ra' || this.role === 'admin';
  }

  canSeeStudentAnnouncements(): boolean {
    return true;
  }

  canSeeAdminLookup(): boolean {
    return this.role === 'admin';
  }

  canSeeMaintenance(): boolean {
    return true;
  }

  canSeeChat(): boolean {
    return true;
  }

  logout(): void {
    this.auth.logout().subscribe({
      next: () => this.router.navigateByUrl('/login'),
      error: () => {
        // even if the API fails, clear UI session + go to login
        this.router.navigateByUrl('/login');
      }
    });
  }
}