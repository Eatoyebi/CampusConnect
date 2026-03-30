import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // If we already have a user in memory, allow fast
  if (auth.isLoggedIn()) return true;

  // Otherwise try restoring session from HttpOnly cookie
  return auth.bootstrap().pipe(
    map(() => true),
    catchError(() => {
      router.navigateByUrl('/login');
      return of(false);
    })
  );
};