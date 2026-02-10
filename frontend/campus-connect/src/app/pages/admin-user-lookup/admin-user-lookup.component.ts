import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User } from '../../shared/services/user.service';

@Component({
  selector: 'app-admin-user-lookup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-user-lookup.component.html',
  styleUrls: ['./admin-user-lookup.component.css']
})
export class AdminUserLookupComponent implements OnInit {
  private userService = inject(UserService);

  query = '';
  users: User[] = [];

  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.search();
  }

  search(): void {
    this.loading = true;
    this.errorMessage = '';

    this.userService.searchUsersAdmin(this.query).subscribe({
      next: (results: User[]) => {
        this.users = results ?? [];
        this.loading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.users = [];
        this.loading = false;

        if (err?.status === 401) {
          this.errorMessage = 'Unauthorized. Missing x-user-id header.';
          return;
        }

        if (err?.status === 403) {
          this.errorMessage = 'Forbidden. You are not an admin.';
          return;
        }

        this.errorMessage = 'Unable to search users right now.';
      }
    });
  }

  trackById(index: number, u: User): string {
    return u._id;
  }
}