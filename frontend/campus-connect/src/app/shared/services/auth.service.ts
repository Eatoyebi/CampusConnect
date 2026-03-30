import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export type Role = 'student' | 'ra' | 'admin' | 'maintenance' | 'staff';

export type AuthedUser = {
  _id: string;
  name: string;
  email: string;
  role: Role;
  universityId?: string;

  raAssignment?: { building?: string; floor?: string };
  housing?: { building?: string; roomNumber?: string; raId?: string };
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiBase = 'http://localhost:5050/api/auth';

  private userSubject = new BehaviorSubject<AuthedUser | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  /** Call on app start to restore session from HttpOnly cookie */
  bootstrap(): Observable<AuthedUser> {
    return this.http
      .get<AuthedUser>(`${this.apiBase}/me`, { withCredentials: true })
      .pipe(tap((u) => this.userSubject.next(u)));
  }

  login(payload: { email: string; password: string; universityId: string }): Observable<any> {
    return this.http
      .post(`${this.apiBase}/login`, payload, { withCredentials: true })
      .pipe(
        tap((res: any) => {
          // Your backend returns { message, user } on login
          if (res?.user) this.userSubject.next(res.user as AuthedUser);
        })
      );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiBase}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => this.userSubject.next(null))
    );
  }

  getUserSnapshot(): AuthedUser | null {
    return this.userSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.userSubject.value;
  }

  isAdmin(): boolean {
    return this.userSubject.value?.role === 'admin';
  }

  isRA(): boolean {
    return this.userSubject.value?.role === 'ra';
  }
}