import { Routes } from '@angular/router';
import { roleGuard } from './shared/guards/role.guard';
import { AdminHousingComponent } from './pages/admin-housing/admin-housing.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then(m => m.Home)
  },
  {
    path: 'chat',
    canActivate: [roleGuard],
    data: { roles: ['student', 'ra', 'admin'] },
    loadComponent: () => import('./pages/chat/chat').then(m => m.ChatComponent)
  },
  {
    path: 'announcements',
    canActivate: [roleGuard],
    data: { roles: ['ra', 'admin'] },
    loadComponent: () => import('./pages/ra-announcements/ra-announcements.component').then(m => m.RaAnnouncements)
  },
  {
    path: 'student-announcements',
    canActivate: [roleGuard],
    data: { roles: ['student', 'ra', 'admin'] },
    loadComponent: () => import('./pages/student-announcements/student-announcements.component').then(m => m.StudentAnnouncementsComponent)
  },
  {
    path: 'maintenance',
    canActivate: [roleGuard],
    data: { roles: ['student', 'ra', 'admin'] },
    loadComponent: () => import('./pages/maintenance/maintenance').then(m => m.Maintenance)
  },
  {
    path: 'profile',
    canActivate: [roleGuard],
    data: { roles: ['student', 'ra', 'admin'] },
    loadComponent: () => import('./pages/user-profile/user-profile.component').then(m => m.UserProfileComponent)
  },
  {
    path: 'admin/users',
    canActivate: [roleGuard],
    data: { roles: ['admin'] },
    loadComponent: () =>
      import('./pages/admin-user-lookup/admin-user-lookup.component').then(m => m.AdminUserLookupComponent)
  },
  {
    path: 'admin-housing',
    component: AdminHousingComponent
  },
  {
    path: 'privacy-policy',
    loadComponent: () =>
      import('./pages/privacy-policy/privacy-policy.component')
        .then(m => m.PrivacyPolicyComponent)
  },
  
  {
    path: 'accessibility',
    loadComponent: () =>
      import('./pages/accessibility/accessibility.component')
        .then(m => m.AccessibilityComponent)
  },
  
  {
    path: 'acceptable-use',
    loadComponent: () =>
      import('./pages/acceptable-use/acceptable-use.component')
        .then(m => m.AcceptableUseComponent)
  },
  

  { path: '**', redirectTo: '' }
];