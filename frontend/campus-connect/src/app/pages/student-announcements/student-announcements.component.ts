import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnnouncementsService, Announcement } from '../ra-announcements/announcements.service';

@Component({
  selector: 'app-student-announcements',
  standalone: true,
  templateUrl: './student-announcements.component.html',
  styleUrls: ['./student-announcements.component.css'],
  imports: [CommonModule, FormsModule],
})
export class StudentAnnouncementsComponent implements OnInit {
  categories = ['general', 'floor', 'building'];
  selectedCategory = '';

  allAnnouncements: Announcement[] = [];

  constructor(private announcementsService: AnnouncementsService) {}

  ngOnInit(): void {
    this.announcementsService.getAnnouncements().subscribe({
      next: (items) => (this.allAnnouncements = items),
      error: (err) => {
        console.error('Failed to load announcements', err);
        this.allAnnouncements = [];
      },
    });
  }

  get count() {
    return this.filteredItems.length;
  }

  get filteredItems(): Announcement[] {
    if (!this.selectedCategory) return this.allAnnouncements;
    return this.allAnnouncements.filter(a => a.category === this.selectedCategory);
  }
}