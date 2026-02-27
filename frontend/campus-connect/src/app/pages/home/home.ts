import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, User } from '../../shared/services/user.service';
import { AnnouncementsService, Announcement } from '../../pages/ra-announcements/announcements.service';
import { TipsService, Tip } from '../../shared/services/tips.service';
import { RouterModule } from '@angular/router';
import { of } from 'rxjs';
@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  imports: [CommonModule, RouterModule]
})
export class Home implements OnInit, OnDestroy {
  user: User | null = null;
  recentAnnouncements: Announcement[] = [];
  tips: Tip[] = [];
  activeTipIndex = 0;

  private tipIntervalId: any;

  constructor(
    private userService: UserService,
    private announcementsService: AnnouncementsService,
    private tipsService: TipsService
  ) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (data: User) => (this.user = data),
      error: (err: any) => console.error('Failed to load current user', err),
    });
  
    // Load announcements from DB

    this.announcementsService.getAnnouncements().subscribe({
      next: (all: Announcement[]) => {
        console.log('home announcements', all);   // <‑‑ add this line
        const sorted = [...all].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.recentAnnouncements = sorted.slice(0, 3);
      },
      error: (err: any) => {
        console.error('Failed to load announcements', err);
        this.recentAnnouncements = [];
      }
    });
    
    
  
    this.tips = this.tipsService.getTips();
    this.startTipRotation();
  }

  ngOnDestroy(): void {
    if (this.tipIntervalId) {
      clearInterval(this.tipIntervalId);
    }
  }

  private startTipRotation(): void {
    if (!this.tips.length) return;

    this.tipIntervalId = setInterval(() => {
      this.activeTipIndex = (this.activeTipIndex + 1) % this.tips.length;
    }, 6000); // 6 seconds
  }

  get activeTip(): Tip | null {
    if (!this.tips.length) return null;
    return this.tips[this.activeTipIndex];
  }
}