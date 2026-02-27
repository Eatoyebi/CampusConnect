import {
  Component,
  AfterViewChecked,
  ElementRef,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ChatService, ChatMsg } from '../../shared/chat.service';
import { MeService, MeUser } from '../../shared/me.service';

type Room = {
  id: string;
  label: string;
  type: 'floor' | 'ra';
};
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class ChatComponent implements AfterViewChecked {
  private chat = inject(ChatService);
  private meService = inject(MeService);

  rooms: Room[] = [];
  activeRoom!: Room;

  me: MeUser | null = null;
  role: 'student' | 'ra' | 'admin' | 'maintenance' | 'staff' = 'student';
  author = 'Guest';

  message = '';
  messages: ChatMsg[] = [];
  loadingHistory = true;

  ownId: string | null = null;

  // moderation menu state
  actionOpenForId: string | null = null;

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef<HTMLDivElement>;
  private stickToBottom = true;

  constructor() {
    this.chat.getMyId().subscribe((id) => (this.ownId = id));

    this.chat.onHistory().subscribe((history) => {
      this.loadingHistory = false;

      this.messages = (history || []).map((m) => ({
        ...m,
        time: m.time ?? (m.createdAt ? new Date(m.createdAt).toLocaleTimeString() : ''),
      }));

      this.queueScroll();
    });

    this.chat.onMessage().subscribe((m) => {
      if (!this.activeRoom || m.room !== this.activeRoom.id) return;

      this.messages.push({
        ...m,
        time: m.time ?? (m.createdAt ? new Date(m.createdAt).toLocaleTimeString() : ''),
      });

      this.queueScroll();
    });

    // backend broadcast → keep clients consistent
    this.chat.onMessageDeleted().subscribe(({ messageId }) => {
      const msg = this.messages.find((x) => x._id === messageId);
      if (msg) {
        msg.isDeleted = true;
        msg.message = '[Message removed by RA]';
      }
    });

    this.initUserAndRooms();
  }

  async initUserAndRooms() {
    let floor = '3';
    let building = 'Unknown';

    try {
      const me = await this.meService.getMe();
      this.me = me;

      this.author = me?.name?.trim() || me?.email?.split('@')?.[0] || 'User';
      this.role = (me?.role || 'student') as any;

      building =
        me?.raAssignment?.building?.trim() ||
        me?.housing?.building?.trim() ||
        'Unknown';

      if ((this.role === 'ra' || this.role === 'admin') && me?.raAssignment?.floor) {
        floor = String(me.raAssignment.floor).trim();
      } else {
        const rn = (me?.housing?.roomNumber || '').toString().trim();
        const match = rn.match(/^(\d+)/);
        if (match?.[1]) floor = match[1].charAt(0);
      }
    } catch {
      this.me = null;
      this.author = 'Guest';
      this.role = 'student';
    }

    const floorRoomId = `Floor_${floor}`;
    const raRoomId = `RA_Floor_${floor}`;

    const nextRooms: Room[] = [
      { id: floorRoomId, label: `${building} • Floor ${floor}`, type: 'floor' },
    ];

    if (this.role === 'ra' || this.role === 'admin') {
      nextRooms.push({ id: raRoomId, label: `RA Channel • Floor ${floor}`, type: 'ra' });
    }

    this.rooms = nextRooms;
    this.activeRoom = this.rooms[0];
    this.switchRoom(this.activeRoom);
  }

  ngAfterViewChecked() {
    if (this.stickToBottom) {
      this.scrollToBottom(false);
      this.stickToBottom = false;
    }
  }

  switchRoom(room: Room) {
    this.activeRoom = room;
    this.messages = [];
    this.loadingHistory = true;
    this.stickToBottom = true;
    this.actionOpenForId = null;

    this.chat.joinRoom(room.id);
  }

  send() {
    const text = this.message.trim();
    if (!text || !this.ownId || !this.activeRoom) return;

    const payload: ChatMsg = {
      room: this.activeRoom.id,
      author: this.author,
      authorId: this.ownId,
      message: text,
      time: new Date().toLocaleTimeString(),
    };

    this.chat.sendMessage(payload);
    this.message = '';
  }

  // ✅ keep Event signature to avoid Angular template typing error
  onEnter(e: Event) {
    const ke = e as KeyboardEvent;
    if (ke.shiftKey) return;
    ke.preventDefault();
    this.send();
  }

  isMine(m: ChatMsg) {
    return !!this.ownId && !!m.authorId && m.authorId === this.ownId;
  }

  isFirstOfGroup(index: number): boolean {
    if (index === 0) return true;
    const prev = this.messages[index - 1];
    const curr = this.messages[index];
    return prev.author !== curr.author;
  }

  trackById(i: number, m: ChatMsg) {
    return m._id ?? i;
  }

  onScroll() {
    const el = this.scrollContainer?.nativeElement;
    if (!el) return;
    this.stickToBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 20;
  }

  isModerator(): boolean {
    return this.role === 'ra' || this.role === 'admin';
  }

  toggleActions(m: ChatMsg) {
    if (!m._id) return;
    this.actionOpenForId = this.actionOpenForId === m._id ? null : m._id;
  }

  async removeMessage(m: ChatMsg) {
    if (!this.isModerator() || !m._id) return;

    // optimistic UI
    m.isDeleted = true;
    m.message = '[Message removed by RA]';
    this.actionOpenForId = null;

    try {
      await this.chat.deleteMessage(m._id, 'Removed by RA');
    } catch (err) {
      console.error('removeMessage failed', err);
      // optional rollback if you want:
      // m.isDeleted = false;
    }
  }

  async flagMessage(m: ChatMsg) {
    if (!this.isModerator()) return;

    this.actionOpenForId = null;

    try {
      await this.chat.flagUser({
        room: this.activeRoom.id,
        targetAuthor: m.author,
        messageId: m._id,
        reason: 'Flagged for review',
      });
    } catch (err) {
      console.error('flagMessage failed', err);
    }
  }

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