import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; 
import { AnnouncementsService, Announcement } from '../../pages/ra-announcements/announcements.service';
import { TipsService, Tip } from '../../shared/services/tips.service';
import { MeService, MeUser } from '../../shared/me.service';
import { RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { User, UserService } from '../../shared/services/user.service';
@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  imports: [CommonModule, RouterModule, RouterLink],
})
export class Home implements OnInit, OnDestroy {
  private meService = inject(MeService);
  private announcementsService = inject(AnnouncementsService);
  private tipsService = inject(TipsService);
  private userService = inject(UserService);


  user: MeUser | null = null;
  loadingUser = true;

  recentAnnouncements: Announcement[] = [];
  tips: Tip[] = [];
  activeTipIndex = 0;

  private tipIntervalId: any;


  ngOnInit(): void {
    this.loadingUser = true;
  
    this.userService.getCurrentUser().subscribe({
      next: (data: User) => {
        console.log("HOME /me returned:", data);
        this.user = data as any;
        this.loadingUser = false;
      },
      error: (err: any) => {
        console.error("HOME /me failed:", err);
        this.user = null;
        this.loadingUser = false;
      },
    });
  
    // announcements (doesn't control loadingUser)
    this.announcementsService.getAnnouncements().subscribe({
      next: (all: Announcement[]) => {
        const sorted = [...all].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.recentAnnouncements = sorted.slice(0, 3);
      },
      error: (err: any) => {
        console.error("Failed to load announcements", err);
        this.recentAnnouncements = [];
      },
    });
  
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