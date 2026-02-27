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
  

  role?: 'student' | 'ra' | 'admin';
  raAssignment?: {
    building?: string;
    floor?: string;
  };
  studentProfile?: {
    major?: string;
    graduationYear?: string | number;
    bio?: string;
    roomId?: string;
    housing?: {
      building?: string;
      roomNumber?: string;
      ra?: string;
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5050/api/users';

  constructor(private http: HttpClient) {}

  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  updateUser(id: string, body: FormData | Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, body);
  }

  searchUsersAdmin(query: string): Observable<User[]> {
    const params = new HttpParams().set('q', query.trim());
    return this.http.get<User[]>(`${this.apiUrl}/admin/users`, { params });
  }

  getUserAdmin(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/admin/users/${id}`);
  }
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`);
  }

  searchUsers(q: string) {
    return this.http.get<User[]>(`${this.apiUrl}/search`, {
      params: { q }
    });
  }

}