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
      import('./pages/ra-announcements/ra-announcements.component').then(m => m.RaAnnouncements)

  },
  {
    path: 'student-announcements',
    loadComponent: () =>
      import('./pages/student-announcements/student-announcements.component').then(m => m.StudentAnnouncementsComponent)
  },  
  {
    path: 'maintenance',
    loadComponent: () =>
      import('./pages/maintenance/maintenance').then(m => m.Maintenance)
  },
  { path: '**', redirectTo: '' }
];