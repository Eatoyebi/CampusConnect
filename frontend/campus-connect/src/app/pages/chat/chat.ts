import { Component, AfterViewChecked, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService, ChatMsg } from '../../shared/chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})
export class ChatComponent implements AfterViewChecked {
  private chat = inject(ChatService);

  room = 'Floor_3';
  author = 'Emmanuel';
  message = '';
  messages: ChatMsg[] = [];

  ownId: string | null = null; // my socket id
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef<HTMLDivElement>;
  private stickToBottom = true;

  constructor() {
    // Subscribe to my socket id
    this.chat.getMyId().subscribe(id => this.ownId = id);

    // ✅ NEW: load chat history when joining/reconnecting
    this.chat.onHistory().subscribe((history) => {
      this.messages = history.map(m => ({
        ...m,
        // ensure time exists for UI
        time: m.time ?? (m.createdAt ? new Date(m.createdAt).toLocaleTimeString() : '')
      }));
      this.queueScroll();
    });

    // Join the room (server responds with chat_history)
    this.chat.joinRoom(this.room);

    // Listen for real-time messages from server
    this.chat.onMessage().subscribe((m) => {
      this.messages.push({
        ...m,
        time: m.time ?? (m.createdAt ? new Date(m.createdAt).toLocaleTimeString() : m.time)
      });
      this.queueScroll();
    });
  }

  ngAfterViewChecked() {
    if (this.stickToBottom) {
      this.scrollToBottom(false);
      this.stickToBottom = false;
    }
  }

  // Send to server only — no local push
  send() {
    const text = this.message.trim();
    if (!text || !this.ownId) return;

    const payload: ChatMsg = {
      room: this.room,
      author: this.author,
      authorId: this.ownId,
      message: text,
      time: new Date().toLocaleTimeString()
    };

    this.chat.sendMessage(payload);
    this.message = ''; // clear input
  }

  isMine(m: ChatMsg) { return !!this.ownId && m.authorId === this.ownId; }

  onScroll() {
    const el = this.scrollContainer?.nativeElement;
    if (!el) return;
    this.stickToBottom = (el.scrollHeight - el.scrollTop - el.clientHeight) < 20;
  }

  trackByIdx(i: number) { return i; }

  private queueScroll() {
    this.stickToBottom = true;
    setTimeout(() => this.scrollToBottom(), 0);
  }

  private scrollToBottom(smooth = true) {
    const el = this.scrollContainer?.nativeElement;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
  }
}