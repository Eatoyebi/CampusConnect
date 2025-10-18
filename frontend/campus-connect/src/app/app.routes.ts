import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home').then(m => m.Home)
  },
  {
    path: 'chat',
    loadComponent: () =>
      import('./pages/chat/chat').then(m => m.Chat)
  },
  {
    path: 'announcements',
    loadComponent: () =>
      import('./pages/announcements/announcements').then(m => m.Announcements)
  },
  {
    path: 'maintenance',
    loadComponent: () =>
      import('./pages/maintenance/maintenance').then(m => m.Maintenance)
  },
  { path: '**', redirectTo: '' }
];