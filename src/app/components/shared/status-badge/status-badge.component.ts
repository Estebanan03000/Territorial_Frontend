import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-badge.component.html',
  styleUrl: './status-badge.component.scss',
})
export class StatusBadgeComponent {
  @Input() status: string = '';

  get text(): string {
    return this.status || 'Sin estado';
  }

  get className(): string {
    const value = this.status.toLowerCase();

    if (value === 'activo' || value === 'activa') {
      return 'badge badge-active';
    }

    if (value === 'inactivo' || value === 'inactiva') {
      return 'badge badge-inactive';
    }

    return 'badge badge-default';
  }
}