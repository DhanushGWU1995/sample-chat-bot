import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatMessage } from '../../models/chat.model';
import { PartCardComponent } from '../part-card/part-card.component';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule, PartCardComponent],
  template: `
    <div class="message" [class.user]="message.role === 'user'" [class.assistant]="message.role === 'assistant'">
      <div class="message-avatar">
        <span *ngIf="message.role === 'user'">👤</span>
        <span *ngIf="message.role === 'assistant'">🤖</span>
      </div>
      <div class="message-content">
        <div class="message-text" [innerHTML]="formatMessage(message.content)"></div>
        
        <!-- Suggested Parts -->
        <div *ngIf="message.suggestedParts && message.suggestedParts.length > 0" class="suggested-parts">
          <h4>Suggested Parts:</h4>
          <div class="parts-grid">
            <app-part-card 
              *ngFor="let part of message.suggestedParts" 
              [part]="part">
            </app-part-card>
          </div>
        </div>
        
        <div class="message-timestamp">
          {{ formatTime(message.timestamp) }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .message {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .message.user {
      flex-direction: row-reverse;
    }

    .message-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      flex-shrink: 0;
      background: var(--bg-color);
    }

    .message.user .message-avatar {
      background: var(--primary-color);
    }

    .message.assistant .message-avatar {
      background: var(--secondary-color);
    }

    .message-content {
      flex: 1;
      max-width: 75%;
    }

    .message.user .message-content {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    .message-text {
      padding: 0.875rem 1.125rem;
      border-radius: 12px;
      line-height: 1.6;
      word-wrap: break-word;
    }

    .message.user .message-text {
      background: var(--primary-color);
      color: white;
      border-bottom-right-radius: 4px;
    }

    .message.assistant .message-text {
      background: white;
      color: var(--text-primary);
      border: 1px solid var(--border-color);
      border-bottom-left-radius: 4px;
    }

    .message-text :deep(strong) {
      font-weight: 600;
      color: var(--primary-color);
    }

    .message.user .message-text :deep(strong) {
      color: white;
      font-weight: 700;
    }

    .message-text :deep(ul),
    .message-text :deep(ol) {
      margin: 0.5rem 0;
      padding-left: 1.5rem;
    }

    .message-text :deep(li) {
      margin: 0.25rem 0;
    }

    .suggested-parts {
      margin-top: 1rem;
      padding: 1rem;
      background: var(--bg-color);
      border-radius: 8px;
    }

    .suggested-parts h4 {
      margin: 0 0 0.75rem 0;
      font-size: 0.95rem;
      color: var(--text-secondary);
    }

    .parts-grid {
      display: grid;
      gap: 0.75rem;
    }

    .message-timestamp {
      font-size: 0.75rem;
      color: var(--text-secondary);
      margin-top: 0.5rem;
    }

    .message.user .message-timestamp {
      text-align: right;
    }

    @media (max-width: 768px) {
      .message-content {
        max-width: 85%;
      }
    }
  `]
})
export class MessageComponent {
  @Input() message!: ChatMessage;

  formatMessage(content: string): string {
    // Convert markdown-style bold to HTML
    let formatted = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert newlines to br tags
    formatted = formatted.replace(/\n/g, '<br>');
    
    // Convert numbered lists
    formatted = formatted.replace(/^\d+\.\s(.+)$/gm, '<li>$1</li>');
    if (formatted.includes('<li>')) {
      formatted = formatted.replace(/(<li>.*<\/li>)/s, '<ol>$1</ol>');
    }
    
    return formatted;
  }

  formatTime(timestamp: Date): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
}
