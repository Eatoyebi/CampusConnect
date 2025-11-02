import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  _id?: string;
  name: string;
  email: string;
  bio?: string;
  major?: string;
  graduationYear?: string;
  profileImage?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5050/api/profile';

  constructor(private http: HttpClient) {}

  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  createUser(data: FormData): Observable<User> {
    return this.http.post<User>(this.apiUrl, data);
  }

  updateUser(id: string, data: FormData): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, data);
  }
}