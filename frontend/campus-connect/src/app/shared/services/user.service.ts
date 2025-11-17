import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
export interface User {
  _id: string;
  name: string;
  email: string;
  major: string;
  graduationYear: number;
  bio: string;
  profileImage?: string;
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
}