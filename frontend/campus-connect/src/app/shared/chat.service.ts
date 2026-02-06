import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, BehaviorSubject } from 'rxjs';

export type ChatMsg = {
  _id?: string;          // Mongo id
  room: string;
  author: string;
  authorId?: string;     // socket id (optional when loaded from DB)
  message: string;
  time?: string;         // optional (we can compute from createdAt)
  createdAt?: string;    // Mongo timestamp
};

@Injectable({ providedIn: 'root' })
export class ChatService {
  private socket!: Socket;

  private myId$ = new BehaviorSubject<string | null>(null);
  private history$ = new BehaviorSubject<ChatMsg[]>([]);

  constructor() {
    this.socket = io('http://localhost:5050', { transports: ['websocket'] });

    this.socket.on('connect', () => {
      console.log('[SOCKET] connected', this.socket.id);
      this.myId$.next(this.socket.id ?? null);
    });

    this.socket.on('disconnect', () => {
      this.myId$.next(null);
    });

    // ✅ NEW: receive history from server when joining a room
    this.socket.on('chat_history', (history: ChatMsg[]) => {
      this.history$.next(history);
    });

    // optional: handle server-side errors
    this.socket.on('chat_error', (err: any) => {
      console.error('[SOCKET] chat_error', err);
    });
  }

  getMyId(): Observable<string | null> {
    return this.myId$.asObservable();
  }

  // ✅ NEW: allow chat component to subscribe to history
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

      return () => {
        this.socket.off('receive_message', handler);
      };
    });
  }
}
