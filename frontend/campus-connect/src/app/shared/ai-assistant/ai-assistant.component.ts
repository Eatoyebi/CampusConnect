import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { AiService } from '../services/ai.service';
import { DevSessionService } from '../services/dev-session.service';

type Sender = 'user' | 'bot';
type AiRole = 'student' | 'ra' | 'admin';

interface ChatMessage {
  sender: Sender;
  text: string;
}

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-assistant.component.html',
  styleUrls: ['./ai-assistant.component.css'],
})
export class AiAssistantComponent {
  open = false;
  input = '';
  loading = false;
  error = '';

  messages: ChatMessage[] = [
    {
      sender: 'bot',
      text: 'Hi! I’m your CampusConnect helper. Ask me how to do anything in the app.',
    },
  ];

  constructor(
    private ai: AiService,
    private devSession: DevSessionService
  ) {}

  toggle() {
    this.open = !this.open;
    this.error = '';
  }

  private getRole(): AiRole {
    const viewAs =
      (this.devSession as any)?.viewAs ??
      (this.devSession as any)?.getViewAs?.();

    const role = String(viewAs || 'student').toLowerCase();

    if (role === 'ra') return 'ra';
    if (role === 'admin') return 'admin';
    return 'student';
  }

  send() {
    const text = this.input.trim();
    if (!text || this.loading) return;

    this.error = '';
    this.messages.push({ sender: 'user', text });
    this.input = '';
    this.loading = true;

    const role = this.getRole();

    // add typing bubble
    const typingIndex = this.messages.push({ sender: 'bot', text: 'Typing…' }) - 1;

    this.ai
      .chat(text, role)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res) => {
          const reply =
            (res?.reply || '').trim() || 'Hmm, I did not get a response back.';

          // replace typing bubble with real reply
          this.messages[typingIndex] = { sender: 'bot', text: reply };
        },
        error: (err) => {
          console.error('AI chat failed:', err);
          this.error = 'AI is having a moment. Try again in a second.';
          this.messages[typingIndex] = {
            sender: 'bot',
            text: 'I ran into an error reaching the server. Double check the backend is running on port 5050.',
          };
        },
      });
  }

  clear() {
    this.error = '';
    this.messages = [
      {
        sender: 'bot',
        text: 'Hi! I’m your CampusConnect helper. Ask me how to do anything in the app.',
      },
    ];
  }
}