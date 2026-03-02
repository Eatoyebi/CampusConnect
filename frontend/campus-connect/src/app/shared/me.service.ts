import { Injectable } from '@angular/core';

export type MeUser = {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  role?: 'student' | 'ra' | 'admin' | 'maintenance' | 'staff';
  universityId?: string;

  housing?: {
    building?: string;
    roomNumber?: string;
    raId?: string;
  };

  raAssignment?: {
    building?: string;
    floor?: string;
  };
};

@Injectable({ providedIn: 'root' })
export class MeService {
  private baseUrl = 'http://localhost:5050';

  async getMe(): Promise<MeUser> {
    const url = `${this.baseUrl}/api/auth/me`;

    const res = await fetch(url, {
      method: 'GET',
      credentials: 'include', // send HttpOnly cookie
      headers: { 'Accept': 'application/json' },
  
    });

    if (!res.ok) {

      throw new Error(`GET /api/auth/me failed (${res.status})`);
    }

    return (await res.json()) as MeUser;
  }
}