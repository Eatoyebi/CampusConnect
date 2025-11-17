import { Injectable } from '@angular/core';

export interface Tip {
  id: number;
  title: string;
  message: string;
  icon?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TipsService {
  private tips: Tip[] = [
    {
      id: 1,
      title: 'Quiet Hours Reminder',
      message: 'Quiet hours start at 10 PM. Headphones on, vibes still high, neighbors still happy.',
      icon: '🌙'
    },
    {
      id: 2,
      title: 'Laundry Pro Tip',
      message: 'Set a timer on your phone when you start laundry so your things aren’t held hostage in the washer.',
      icon: '🧺'
    },
    {
      id: 3,
      title: 'Safety First',
      message: 'Always make sure the main doors close behind you. If something feels off, find your RA or call campus safety.',
      icon: '🛡️'
    },
    {
      id: 4,
      title: 'Stay In The Loop',
      message: 'Check announcements often so you never miss free food, events, or building updates.',
      icon: '📢'
    }
  ];

  getTips(): Tip[] {
    return this.tips;
  }
}