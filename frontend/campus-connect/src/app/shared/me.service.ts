import { Injectable } from '@angular/core';

export type MeUser = {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  role?: 'student' | 'ra' | 'admin' | 'maintenance' | 'staff';

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
    const url = `${this.baseUrl}/api/users/me`;

    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!res.ok) {
      throw new Error(`GET /api/users/me failed (${res.status})`);
    }

    return (await res.json()) as MeUser;
  }
}