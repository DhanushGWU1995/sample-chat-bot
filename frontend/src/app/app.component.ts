import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatInterfaceComponent } from './components/chat-interface/chat-interface.component';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ChatInterfaceComponent, HeaderComponent],
  template: `
    <div class="app-container">
      <app-header></app-header>
      <main class="main-content">
        <app-chat-interface></app-chat-interface>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .main-content {
      flex: 1;
      display: flex;
      justify-content: center;
      padding: 20px;
    }
  `]
})
export class AppComponent {
  title = 'PartSelect Chat Assistant';
}
