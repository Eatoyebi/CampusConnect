import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService, User } from '../../shared/services/user.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  private router = inject(Router);
  private userService = inject(UserService);

  user: User | null = null;
  loading = true;
  errorMessage = '';

  editing = false;
  updatedUser: Partial<User> = {};
  selectedFile: File | null = null;
  previewImage: string | ArrayBuffer | null = null;

  ngOnInit(): void {
    this.loading = true;
    this.errorMessage = '';

    
    this.userService.getCurrentUser().subscribe({
      next: (data: User) => {
        this.user = data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.errorMessage = 'Unable to load profile.';
        this.loading = false;
      },
    });
  }

  goToAdminLookup(): void {
    this.router.navigate(['/admin/users']);
  }

  toggleEdit(): void {
    if (!this.user) return;

    this.editing = !this.editing;

    if (this.editing) {
      this.updatedUser = {
        name: this.user.name,
        email: this.user.email,
        major: this.user.major,
        graduationYear: this.user.graduationYear,
        bio: this.user.bio,
      };


      this.previewImage = this.getProfileImageUrl(this.user.profileImage);
    } else {
      this.updatedUser = {};
      this.selectedFile = null;
      this.previewImage = null;
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => (this.previewImage = reader.result);
      reader.readAsDataURL(this.selectedFile);
    }
  }

  saveChanges(): void {
    const user = this.user;
    if (!user?._id) return;

    const formData = new FormData();

    if (this.updatedUser.name != null) formData.append('name', String(this.updatedUser.name));
    if (this.updatedUser.email != null) formData.append('email', String(this.updatedUser.email));
    if (this.updatedUser.major != null) formData.append('major', String(this.updatedUser.major));
    if (this.updatedUser.graduationYear != null) formData.append('graduationYear', String(this.updatedUser.graduationYear));
    if (this.updatedUser.bio != null) formData.append('bio', String(this.updatedUser.bio));

    if (this.selectedFile) {
      formData.append('profileImage', this.selectedFile);
    }

    this.userService.updateUser(user._id, formData).subscribe({
      next: (updated) => {
        this.user = {
          ...user,
          ...updated,
        };

        this.previewImage = null;
        this.selectedFile = null;
        this.editing = false;
        this.updatedUser = {};
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error updating profile.';
      },
    });
  }

  removeImage(): void {
    const user = this.user;
    if (!user?._id) return;

    if (!confirm('Are you sure you want to remove your profile picture?')) return;

    const formData = new FormData();
    formData.append('profileImage', '');

    this.userService.updateUser(user._id, formData).subscribe({
      next: (updated) => {
        this.user = {
          ...user,
          ...updated,
          profileImage: '/profile-icon.svg',
        };

        this.previewImage = null;
        this.selectedFile = null;
        this.editing = false;
        this.updatedUser = {};
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error removing profile image.';
      },
    });
  }


  
  getProfileImageUrl(img?: string | null): string | null {
    if (!img) return null;

    const s = String(img);

    if (s.startsWith('http')) return s;
    if (s.startsWith('/')) return s;

    return `http://localhost:5050/uploads/${s}`;
  }

  getPreviewImageUrl(): string | null {
    if (!this.previewImage) return null;
    return typeof this.previewImage === 'string'
      ? this.previewImage
      : null;
  }
}