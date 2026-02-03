import { Injectable } from '@angular/core';

export type Role = 'student' | 'ra' | 'admin';

@Injectable({ providedIn: 'root' })
export class AuthService {
  demoUsers = {
    ra: '691256de5e28c208bd523047',
    student: '6980f73a4727663ded2c0308',
    admin: '6980f77d4727663ded2c030a',
  } as const;

  private roleKey: keyof typeof this.demoUsers = 'student';

  setRole(roleKey: keyof typeof this.demoUsers) {
    this.roleKey = roleKey;
    localStorage.setItem('demoRole', roleKey);
  }

  loadFromStorage() {
    const saved = localStorage.getItem('demoRole') as keyof typeof this.demoUsers | null;
    if (saved && this.demoUsers[saved]) this.roleKey = saved;
  }

  getRoleKey() {
    return this.roleKey;
  }

  getUserId(): string {
    return this.demoUsers[this.roleKey];
  }

  getRole(): Role {
    return this.roleKey;
  }

  isAdmin() {
    return this.getRole() === 'admin';
  }

  isRA() {
    return this.getRole() === 'ra';
  }
}