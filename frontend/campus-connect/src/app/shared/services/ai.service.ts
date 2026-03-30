import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

type AiRole = 'student' | 'ra' | 'admin';

@Injectable({ providedIn: 'root' })
export class AiService {
  private readonly baseUrl = 'http://localhost:5050/api/ai';

  constructor(private http: HttpClient) {}

  chat(message: string, role: AiRole): Observable<{ reply: string }> {
    return this.http.post<{ reply: string }>(`${this.baseUrl}/chat`, {
      message,
      role,
    });
  }
}