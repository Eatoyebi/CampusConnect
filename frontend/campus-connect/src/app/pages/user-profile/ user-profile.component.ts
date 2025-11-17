import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  
  user: any = {};
  isEditing = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    const testUserId = '672d1d03c373ab25d4f0d9b1';

    this.userService.getUser(testUserId).subscribe({
      next: (data) => this.user = data,
      error: (err) => console.error(err)
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  saveChanges() {
    const testUserId = '672d1d03c373ab25d4f0d9b1';

    this.userService.updateUser(testUserId, this.user).subscribe({
      next: (updated) => {
        this.user = updated;
        this.isEditing = false;
      },
      error: (err) => console.error(err)
    });
  }
}