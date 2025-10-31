import { Injectable } from '@angular/core';

export interface Announcement {
  id: number;
  title: string;
  message: string;
  category: string;
  createdAt: Date;
}

@Injectable({ providedIn: 'root' })
export class AnnouncementsService {
  private announcements: Announcement[] = [
    {
      id: 1,
      title: 'Fire Drill Friday',
      message: 'There will be a fire drill on all floors this Friday at 6 PM.',
      category: 'floor',
      createdAt: new Date('2025-10-20T18:00:00')
    },
    {
      id: 2,
      title: 'Movie Night',
      message: 'RA-hosted movie night in the building lobby on Saturday!',
      category: 'building',
      createdAt: new Date('2025-10-19T19:00:00')
    },
    {
      id: 3,
      title: 'Welcome New Residents!',
      message: 'We are excited to welcome new residents this semester. Please attend orientation in Room 101 at 3 PM.',
      category: 'general',
      createdAt: new Date('2025-10-18T15:00:00')
    }
  ];

  getAnnouncements() {
    return this.announcements;
  }

  addAnnouncement(announcement: Announcement) {
    this.announcements.unshift(announcement);
  }
}
