import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Official } from 'src/app/models/official';

@Component({
  selector: 'app-official-tracking-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './official-tracking-list.component.html',
  styleUrl: './official-tracking-list.component.scss',
})
export class OfficialTrackingListComponent {
  @Input() officials: Official[] = [];
  @Input() selectedOfficialId?: number;
  @Input() loading = false;

  @Output() officialSelected = new EventEmitter<Official>();
  @Output() searchChange = new EventEmitter<string>();

  searchText = '';

  onSearchChange(): void {
    this.searchChange.emit(this.searchText.trim());
  }

  onSelect(official: Official): void {
    this.officialSelected.emit(official);
  }

  getStatusText(official: Official): string {
    if (!this.hasLocation(official)) {
      return 'Sin ubicación';
    }

    if (official.gps_active) {
      return 'En línea';
    }

    return 'Última posición';
  }

  getStatusClass(official: Official): string {
    if (!this.hasLocation(official)) {
      return 'offline';
    }

    if (official.gps_active) {
      return 'online';
    }

    return 'last-known';
  }

  getInitials(name?: string): string {
    if (!name) {
      return 'F';
    }

    return name
      .split(' ')
      .filter((part) => part.trim() !== '')
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join('');
  }

  getLastUpdate(official: Official): string {
    if (!official.last_gps_update) {
      return 'Sin actualización';
    }

    const date = new Date(official.last_gps_update);

    if (isNaN(date.getTime())) {
      return official.last_gps_update;
    }

    return date.toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  private hasLocation(official: Official): boolean {
    return official.last_latitude !== null &&
      official.last_latitude !== undefined &&
      official.last_longitude !== null &&
      official.last_longitude !== undefined;
  }
}
