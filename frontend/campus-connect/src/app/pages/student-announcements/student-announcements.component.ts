import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnnouncementsService, Announcement } from '../ra-announcements/announcements.service'; // Adjust path if needed
import { Observable } from 'rxjs';

announcements$: Observable<Announcement>;
@Component({
  selector: 'app-student-announcements',
  templateUrl: './student-announcements.component.html',
  styleUrls: ['./student-announcements.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})

export class StudentAnnouncementsComponent {
  categories = ['general', 'floor', 'building'];
  selectedCategory = '';
  allAnnouncements: Announcement[] = [];

  constructor(private announcementsService: AnnouncementsService) {
    this.announcementsService.getAnnouncements().subscribe(
      (items: Announcement[]) => {
        this.allAnnouncements = items;
      },
      (err) => {
        console.error('Failed to load announcements', err);
        this.allAnnouncements = [];
      }
    );
    
  }

  get count() {
    return this.filteredItems.length;
  }

  get filteredItems(): Announcement[] {
    if (!this.selectedCategory) return this.allAnnouncements;
    return this.allAnnouncements.filter(a => a.category === this.selectedCategory);
  }
  
}
