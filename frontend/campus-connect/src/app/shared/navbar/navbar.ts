import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DevSessionService, Role } from '../services/dev-session.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar implements OnInit {
  private session = inject(DevSessionService);

  demoUsers: Record<Role, string> = {
    ra: '691256de5e28c208bd523047',
    student: '6980f73a4727663ded2c0308',
    admin: '6980f77d4727663ded2c030a'
  };

  selectedRole: Role = 'student';

  ngOnInit(): void {
    this.selectedRole = this.session.role;

    if (!this.session.userId) {
      this.session.setSession(this.selectedRole, this.demoUsers[this.selectedRole]);
    }
  }

  applyRole(): void {
    this.session.setSession(this.selectedRole, this.demoUsers[this.selectedRole]);
    window.location.reload();
  }

  get role(): Role {
    return this.session.role;
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
}