import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, BehaviorSubject } from 'rxjs';

export type ChatMsg = {
  _id?: string;          // Mongo id
  room: string;
  author: string;
  authorId?: string;     // socket id
  message: string;
  time?: string;
  createdAt?: string;

  // moderation (✅ single flag)
  isDeleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;

  // UI-only helper
  _menuOpen?: boolean;
};

@Injectable({ providedIn: 'root' })
export class ChatService {
  private socket!: Socket;

  private myId$ = new BehaviorSubject<string | null>(null);
  private history$ = new BehaviorSubject<ChatMsg[]>([]);

  private apiBase = 'http://localhost:5050';

  constructor() {
    this.socket = io('http://localhost:5050', { transports: ['websocket'] });

    this.socket.on('connect', () => {
      this.myId$.next(this.socket.id ?? null);
    });

    this.socket.on('disconnect', () => {
      this.myId$.next(null);
    });

    this.socket.on('chat_history', (history: ChatMsg[]) => {
      this.history$.next(history || []);
    });

    this.socket.on('chat_error', (err: any) => {
      console.error('[SOCKET] chat_error', err);
    });
  }

  getMyId(): Observable<string | null> {
    return this.myId$.asObservable();
  }

  onHistory(): Observable<ChatMsg[]> {
    return this.history$.asObservable();
  }

  joinRoom(room: string) {
    if (this.socket.connected) this.socket.emit('join_room', room);
    else this.socket.once('connect', () => this.socket.emit('join_room', room));
  }

  sendMessage(payload: ChatMsg) {
    this.socket.emit('send_message', payload);
  }

  onMessage(): Observable<ChatMsg> {
    return new Observable(observer => {
      const handler = (data: ChatMsg) => observer.next(data);
      this.socket.on('receive_message', handler);
      return () => this.socket.off('receive_message', handler);
    });
  }

  // broadcast from backend: io.to(room).emit("message_deleted", { messageId })
  onMessageDeleted(): Observable<{ messageId: string }> {
    return new Observable(observer => {
      const handler = (data: { messageId: string }) => observer.next(data);
      this.socket.on('message_deleted', handler);
      return () => this.socket.off('message_deleted', handler);
    });
  }

  // ===== Moderation HTTP APIs =====

  private getAuthHeader(): Record<string, string> {
    const token =
      localStorage.getItem('token') ||
      localStorage.getItem('access_token') ||
      localStorage.getItem('authToken') ||
      '';

    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async deleteMessage(messageId: string, reason = ''): Promise<void> {
    const url = `${this.apiBase}/api/chat/messages/${messageId}?reason=${encodeURIComponent(reason)}`;

    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...this.getAuthHeader(),
      },
    });

    if (!res.ok) {
      throw new Error(`Delete failed (${res.status})`);
    }
  }

  async flagUser(payload: {
    room: string;
    targetUserId?: string;
    targetAuthor?: string;
    messageId?: string;
    reason?: string;
  }): Promise<void> {
    const url = `${this.apiBase}/api/chat/flags`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Flag failed (${res.status})`);
    }
  }
}