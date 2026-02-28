import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

import { AuthService, Role } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const allowed = (route.data?.['roles'] as Role[] | undefined) ?? [];

  // If no roles listed, treat it like “auth required”
  const requireAuth = allowed.length === 0;

  const decide = (): boolean => {
    const me = auth.getUserSnapshot();

    // Not logged in
    if (!me) return false;

    // Logged in but no role restrictions
    if (allowed.length === 0) return true;

    // Role allowed
    return allowed.includes(me.role);
  };

  // Fast path
  if (auth.isLoggedIn()) {
    const ok = decide();
    if (!ok) router.navigateByUrl('/'); // or '/profile' if you want
    return ok;
  }

  // Otherwise try to restore from cookie
  return auth.bootstrap().pipe(
    map(() => {
      const ok = decide();

      if (!ok) {
        // If user exists but role is wrong go home
        // If user does not exist go login
        router.navigateByUrl(auth.isLoggedIn() ? '/' : '/login');
      }

      // If auth is required and user isn’t logged in, send to login
      if (requireAuth && !auth.isLoggedIn()) {
        router.navigateByUrl('/login');
        return false;
      }

      return ok;
    }),
    catchError(() => {
      router.navigateByUrl('/login');
      return of(false);
    })
  );
};