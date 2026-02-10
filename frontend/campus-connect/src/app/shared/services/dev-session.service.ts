import { Injectable } from '@angular/core';

export type Role = 'student' | 'ra' | 'admin';

interface SessionState {
  role: Role;
  userId: string;
}

const STORAGE_KEY = 'campusconnect.devSession';

@Injectable({ providedIn: 'root' })
export class DevSessionService {
  private _role: Role = 'student';
  private _userId = '';

  constructor() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as Partial<SessionState>;
      if (parsed.role) this._role = parsed.role;
      if (parsed.userId) this._userId = parsed.userId;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  get role(): Role {
    return this._role;
  }

  get userId(): string {
    return this._userId;
  }

  setSession(role: Role, userId: string): void {
    this._role = role;
    this._userId = userId;

    const state: SessionState = { role, userId };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  clear(): void {
    this._role = 'student';
    this._userId = '';
    localStorage.removeItem(STORAGE_KEY);
  }
}