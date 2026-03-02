import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class AnnouncementsApi {
  private baseUrl = "http://localhost:5050/api/announcements";

  constructor(private http: HttpClient) {}

  create(payload: any): Observable<any> {
    return this.http.post(this.baseUrl, payload);
  }

  list(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
  
}
