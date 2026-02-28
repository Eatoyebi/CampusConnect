import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  _id: string;
  name: string;
  email: string;
  major?: string;
  graduationYear?: string | number;
  bio?: string;
  profileImage?: string;

  role?: 'student' | 'ra' | 'admin' | 'maintenance' | 'staff';
  universityId?: string;

  raAssignment?: {
    building?: string;
    floor?: string;
  };

  housing?: {
    building?: string;
    roomNumber?: string;
    raId?: string;
  };
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:5050/api/users';
  private authUrl = 'http://localhost:5050/api/auth';

  constructor(private http: HttpClient) {}


  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`, {
      withCredentials: true,
    });
  }

  updateUser(id: string, body: FormData | Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, body, {
      withCredentials: true,
    });
  }


  searchUsersAdmin(query: string): Observable<User[]> {
    const params = new HttpParams().set('q', query.trim());
    return this.http.get<User[]>(`${this.apiUrl}/admin/users`, {
      params,
      withCredentials: true,
    });
  }


  getUserAdmin(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/admin/users/${id}`, {
      withCredentials: true,
    });
  }


  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.authUrl}/me`, {
      withCredentials: true,
    });
  }
}