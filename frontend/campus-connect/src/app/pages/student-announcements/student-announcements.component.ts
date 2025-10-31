import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnnouncementsService, Announcement } from '../ra-announcements/announcements.service'; // Adjust path if needed

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
    this.allAnnouncements = this.announcementsService.getAnnouncements();
  }

  get count() {
    return this.filteredItems.length;
  }

  get filteredItems(): Announcement[] {
    if (!this.selectedCategory) return this.allAnnouncements;
    return this.allAnnouncements.filter(a => a.category === this.selectedCategory);
  }
  
}
