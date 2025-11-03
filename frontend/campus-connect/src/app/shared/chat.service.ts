import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, BehaviorSubject } from 'rxjs';

export type ChatMsg = {
  room: string;
  author: string;
  authorId: string;
  message: string;
  time: string;
};

@Injectable({ providedIn: 'root' })
export class ChatService {
  private socket!: Socket;
  private myId$ = new BehaviorSubject<string | null>(null);

  constructor() {
    this.socket = io('http://localhost:5050', { transports: ['websocket'] });

    this.socket.on('connect', () => {
      console.log('[SOCKET] connected', this.socket.id);
      this.myId$.next(this.socket.id ?? null);
    });

    this.socket.on('disconnect', () => {
      this.myId$.next(null);
    });
  }

  getMyId(): Observable<string | null> {
    return this.myId$.asObservable();
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
      // Teardown logic: remove the handler when unsubscribed
      return () => {
        this.socket.off('receive_message', handler);
      };
    });
  }
}