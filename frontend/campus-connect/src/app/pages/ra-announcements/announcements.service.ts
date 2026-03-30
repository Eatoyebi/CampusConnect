import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

export interface Announcement {
  id: string;
  title: string;
  body: string;
  category: string;
  createdAt: string;
}


@Injectable({ providedIn: 'root' })
export class AnnouncementsService {
  constructor(private http: HttpClient) {}

    getAnnouncements(): Observable<Announcement[]> {
      return this.http.get<any[]>('http://localhost:5050/api/announcements').pipe(
        map(items =>
          items.map(a => ({
            id: a._id ?? a.id,
            title: a.title,
            body: a.body ?? a.message ?? '',
            category: a.category ?? a.audience ?? 'general',
            createdAt: a.createdAt
          }))
        )
      );
    }
  
}
