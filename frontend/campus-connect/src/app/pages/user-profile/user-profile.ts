import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export class UserProfile {
  user = {
    name: 'Liz Atoyebi',
    major: 'Software Application Development',
    grade: 'Senior',
    bio: 'Aspiring software engineer passionate about inclusion and innovation.'
  };
}