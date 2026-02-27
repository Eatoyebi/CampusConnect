import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Announcement {
  id: number;
  title: string;
  body: string;
  category: string;
  createdAt: Date;
}


@Injectable({ providedIn: 'root' })
export class AnnouncementsService {
  constructor(private http: HttpClient) {}

  getAnnouncements(): Observable<Announcement[]> {
    return this.http.get<Announcement[]>('http://localhost:5050/api/announcements');
  }
  
}
