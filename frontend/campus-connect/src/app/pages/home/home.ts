import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, User } from '../../shared/services/user.service';
import { AnnouncementsService, Announcement } from '../../pages/ra-announcements/announcements.service';
import { TipsService, Tip } from '../../shared/services/tips.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  imports: [CommonModule]
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
    const userId = '691256de5e28c208bd523047';

    this.userService.getUser(userId).subscribe({
      next: (data: User) => {
        this.user = data;
      },
      error: (err: any) => {
        console.error('Failed to load user', err);
      }
    });

    const allAnnouncements = this.announcementsService.getAnnouncements();
    this.recentAnnouncements = allAnnouncements.slice(0, 3); // newest 3

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