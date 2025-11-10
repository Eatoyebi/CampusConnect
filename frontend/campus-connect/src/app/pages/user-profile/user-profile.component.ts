import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User } from '../../services/user.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  private userService = inject(UserService);
  user: User | null = null;
  loading = true;
  errorMessage = '';
  editing = false;
  updatedUser: Partial<User> = {};
  selectedFile: File | null = null;
  previewImage: string | ArrayBuffer | null = null;

  ngOnInit(): void {
    const userId = '691256de5e28c208bd523047';
    this.userService.getUser(userId).subscribe({
      next: (data) => {
        console.log('User data received:', data);
        this.user = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Unable to load profile.';
        this.loading = false;
      }
    });
  }

  toggleEdit(): void {
    if (this.user) {
      this.editing = !this.editing;
      this.updatedUser = { ...this.user };
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
  if (!this.user?._id) return;

  const formData = new FormData();
  Object.entries(this.updatedUser).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value.toString());
    }
  });

  if (this.selectedFile) {
    formData.append('profileImage', this.selectedFile);
  }

  this.userService.updateUser(this.user._id, formData).subscribe({
    next: (updated) => {
      this.user = {
        ...updated,
        profileImage: updated.profileImage?.startsWith('http')
          ? updated.profileImage
          : `http://localhost:5050/uploads/${updated.profileImage}`
      };
      this.previewImage = null;
      this.editing = false;
    },
    error: (err) => {
      console.error(err);
      this.errorMessage = 'Error updating profile.';
    }
  });
}

removeImage(): void {
  if (!this.user?._id) return;

  if (confirm('Are you sure you want to remove your profile picture?')) {
    const formData = new FormData();
    formData.append('profileImage', '');
    this.userService.updateUser(this.user._id, formData).subscribe({
      next: (updated) => {
        this.user = {
          ...updated,
          profileImage: '/profile-icon.svg'
        };
        this.previewImage = null;
        this.selectedFile = null;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error removing profile image.';
      }
    });
  }
}
}