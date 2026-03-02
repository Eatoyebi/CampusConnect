import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DevSessionService } from '../services/dev-session.service';

@Injectable()
export class DevAuthInterceptor implements HttpInterceptor {
  private session = inject(DevSessionService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const userId = this.session.userId;

    const cloned = req.clone({
      setHeaders: {
        'x-user-id': userId,
      },
    });

    return next.handle(cloned);
  }
}