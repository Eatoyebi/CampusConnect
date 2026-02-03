import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { DevSessionService } from '../services/dev-session.service';

export type Role = 'student' | 'ra' | 'admin';

export const roleGuard: CanActivateFn = (route) => {
  const session = inject(DevSessionService);
  const router = inject(Router);

  const allowed = (route.data?.['roles'] as Role[] | undefined) ?? [];

  // If no roles listed, allow by default
  if (allowed.length === 0) return true;

  // Allow if current role is in allowed list
  if (allowed.includes(session.role)) return true;

  router.navigateByUrl('/profile');
  return false;
};