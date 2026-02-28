import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; 
import { AnnouncementsService, Announcement } from '../../pages/ra-announcements/announcements.service';
import { TipsService, Tip } from '../../shared/services/tips.service';
import { MeService, MeUser } from '../../shared/me.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  imports: [CommonModule, RouterLink],
})
export class Home implements OnInit, OnDestroy {
  private meService = inject(MeService);
  private announcementsService = inject(AnnouncementsService);
  private tipsService = inject(TipsService);


  user: MeUser | null = null;
  loadingUser = true;

  recentAnnouncements: Announcement[] = [];
  tips: Tip[] = [];
  activeTipIndex = 0;

  private tipIntervalId: any;

  async ngOnInit(): Promise<void> {
    this.loadingUser = true;
    try {
      this.user = await this.meService.getMe();
    } catch (err) {
      // 401 expected when not logged in
      this.user = null;
    } finally {
      this.loadingUser = false;
    }

    // announcements + tips are still local services
    const allAnnouncements = this.announcementsService.getAnnouncements();
    this.recentAnnouncements = allAnnouncements.slice(0, 3);

    this.tips = this.tipsService.getTips();
    this.startTipRotation();
  }

  ngOnDestroy(): void {
    if (this.tipIntervalId) clearInterval(this.tipIntervalId);
  }

  private startTipRotation(): void {
    if (!this.tips.length) return;

    this.tipIntervalId = setInterval(() => {
      this.activeTipIndex = (this.activeTipIndex + 1) % this.tips.length;
    }, 6000);
  }

  get activeTip(): Tip | null {
    if (!this.tips.length) return null;
    return this.tips[this.activeTipIndex];
  }
}