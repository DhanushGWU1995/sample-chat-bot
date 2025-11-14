import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Part } from '../../models/chat.model';

@Component({
  selector: 'app-part-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="part-card">
      <div class="part-header">
        <div class="part-number">{{ part.part_number }}</div>
        <span class="stock-badge" [class.in-stock]="part.in_stock" [class.out-of-stock]="!part.in_stock">
          {{ part.in_stock ? 'In Stock' : 'Out of Stock' }}
        </span>
      </div>
      
      <h3 class="part-name">{{ part.name }}</h3>
      <p class="part-description">{{ part.description }}</p>
      
      <div class="part-footer">
        <div class="part-category">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M3 3h10v2H3V3zm0 4h10v2H3V7zm0 4h10v2H3v-2z"/>
          </svg>
          {{ part.category }}
        </div>
        <div class="part-price">\${{ part.price.toFixed(2) }}</div>
      </div>
    </div>
  `,
  styles: [`
    .part-card {
      background: white;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 1rem;
      transition: all 0.2s;
    }

    .part-card:hover {
      box-shadow: var(--shadow);
      border-color: var(--primary-color);
    }

    .part-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .part-number {
      font-family: 'Courier New', monospace;
      font-size: 0.85rem;
      color: var(--primary-color);
      font-weight: 600;
      background: rgba(0, 102, 204, 0.1);
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
    }

    .stock-badge {
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-weight: 500;
    }

    .stock-badge.in-stock {
      background: rgba(40, 167, 69, 0.1);
      color: var(--secondary-color);
    }

    .stock-badge.out-of-stock {
      background: rgba(220, 53, 69, 0.1);
      color: #dc3545;
    }

    .part-name {
      font-size: 1rem;
      font-weight: 600;
      margin: 0 0 0.5rem 0;
      color: var(--text-primary);
    }

    .part-description {
      font-size: 0.875rem;
      color: var(--text-secondary);
      margin: 0 0 1rem 0;
      line-height: 1.5;
    }

    .part-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 0.75rem;
      border-top: 1px solid var(--border-color);
    }

    .part-category {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      font-size: 0.85rem;
      color: var(--text-secondary);
    }

    .part-price {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--primary-color);
    }
  `]
})
export class PartCardComponent {
  @Input() part!: Part;
}
