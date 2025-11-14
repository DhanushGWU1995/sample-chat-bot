import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { ChatMessage, Part } from '../../models/chat.model';
import { MessageComponent } from '../message/message.component';
import { PartCardComponent } from '../part-card/part-card.component';

@Component({
  selector: 'app-chat-interface',
  standalone: true,
  imports: [CommonModule, FormsModule, MessageComponent, PartCardComponent],
  templateUrl: './chat-interface.component.html',
  styleUrls: ['./chat-interface.component.css']
})
export class ChatInterfaceComponent implements OnInit {
  messages: ChatMessage[] = [];
  userInput: string = '';
  isLoading: boolean = false;
  sessionId: string = '';

  quickActions = [
    { text: 'How do I install an ice maker?', icon: '🔧' },
    { text: 'Check compatibility for WDT780SAEM1', icon: '✓' },
    { text: 'Ice maker not working', icon: '❄️' },
    { text: 'Dishwasher not draining', icon: '💧' }
  ];

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.initializeChat();
    this.chatService.messages$.subscribe(messages => {
      this.messages = messages;
      setTimeout(() => this.scrollToBottom(), 100);
    });
  }

  initializeChat(): void {
    this.chatService.createSession().subscribe({
      next: (response) => {
        this.sessionId = response.sessionId;
        this.chatService.setSessionId(response.sessionId);
        
        // Add welcome message
        this.chatService.addAssistantMessage(response.message);
      },
      error: (error) => {
        console.error('Failed to create session:', error);
        this.chatService.addAssistantMessage(
          'Welcome to PartSelect Chat! I can help you with refrigerator and dishwasher parts. (Note: Connection to server failed - please ensure backend is running)'
        );
      }
    });
  }

  sendMessage(message?: string): void {
    const messageToSend = message || this.userInput.trim();
    
    if (!messageToSend || this.isLoading) return;

    this.userInput = '';
    this.isLoading = true;

    this.chatService.sendMessage(messageToSend).subscribe({
      next: (response) => {
        this.chatService.addAssistantMessage(response.response, response.suggestedParts);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Chat error:', error);
        this.chatService.addAssistantMessage(
          'I apologize, but I encountered an error. Please make sure the backend server is running and try again.'
        );
        this.isLoading = false;
      }
    });
  }

  handleQuickAction(action: string): void {
    this.sendMessage(action);
  }

  handleKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  clearChat(): void {
    if (confirm('Are you sure you want to clear the chat?')) {
      this.chatService.clearMessages();
      this.initializeChat();
    }
  }

  private scrollToBottom(): void {
    const chatContainer = document.querySelector('.messages-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }
}
