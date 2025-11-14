import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header">
      <div class="container header-content">
        <div class="logo">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="6" fill="#0066cc"/>
            <path d="M16 8L24 16L16 24L8 16L16 8Z" fill="white"/>
          </svg>
          <h1>PartSelect</h1>
        </div>
        <div class="header-subtitle">
          <span class="badge">AI Assistant</span>
          <p>Refrigerator & Dishwasher Parts Expert</p>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background: linear-gradient(135deg, #0066cc 0%, #0052a3 100%);
      color: white;
      padding: 1.5rem 0;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .logo h1 {
      font-size: 1.75rem;
      font-weight: 700;
      margin: 0;
    }

    .header-subtitle {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .header-subtitle p {
      margin: 0;
      font-size: 0.95rem;
      opacity: 0.95;
    }

    .badge {
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      padding: 0.35rem 0.75rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 500;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        text-align: center;
      }
      
      .header-subtitle {
        flex-direction: column;
        gap: 0.5rem;
      }
    }
  `]
})
export class HeaderComponent {}
