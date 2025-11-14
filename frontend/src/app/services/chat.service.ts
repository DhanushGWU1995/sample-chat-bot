import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { ChatMessage, ChatResponse, Part, Product, InstallationGuide, CompatibilityInfo } from '../models/chat.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:3000/api';
  private sessionId: string = '';
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  constructor(private http: HttpClient) {}

  createSession(): Observable<{ sessionId: string; message: string }> {
    return this.http.post<{ sessionId: string; message: string }>(`${this.apiUrl}/chat/session`, {});
  }

  setSessionId(sessionId: string): void {
    this.sessionId = sessionId;
  }

  getSessionId(): string {
    return this.sessionId;
  }

  sendMessage(message: string): Observable<ChatResponse> {
    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
      timestamp: new Date()
    };
    
    // Add user message to local state
    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([...currentMessages, userMessage]);

    return this.http.post<ChatResponse>(`${this.apiUrl}/chat/message`, {
      sessionId: this.sessionId,
      message: message
    });
  }

  addAssistantMessage(response: string, parts?: Part[]): void {
    const assistantMessage: ChatMessage = {
      role: 'assistant',
      content: response,
      timestamp: new Date(),
      suggestedParts: parts
    };
    
    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([...currentMessages, assistantMessage]);
  }

  clearMessages(): void {
    this.messagesSubject.next([]);
  }

  getMessages(): ChatMessage[] {
    return this.messagesSubject.value;
  }
}
