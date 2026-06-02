import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Entity } from '../../../../models/entity';
import { Official } from '../../../../models/official';

@Component({
  selector: 'app-official-table',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './official-table.component.html',
  styleUrl: './official-table.component.scss',
})
export class OfficialTableComponent {
  @Input() officials: Official[] = [];
  @Input() entities: Entity[] = [];
  @Input() loading = false;

  @Output() editOfficial = new EventEmitter<number>();
  @Output() deleteOfficial = new EventEmitter<Official>();
  @Output() activateOfficial = new EventEmitter<Official>();
  @Output() deactivateOfficial = new EventEmitter<Official>();
  @Output() startTrackingOfficial = new EventEmitter<Official>();
  @Output() stopTrackingOfficial = new EventEmitter<Official>();

  getEntityName(idEntity: number): string {
    const entity = this.entities.find((item) => item.id_entity === idEntity);
    return entity ? entity.name : 'Sin entidad';
  }

  isActive(official: Official): boolean {
    return official.status === 'activo';
  }

  onEdit(official: Official): void {
    if (official.id_official) {
      this.editOfficial.emit(official.id_official);
    }
  }

  onDelete(official: Official): void {
    this.deleteOfficial.emit(official);
  }

  onActivate(official: Official): void {
    this.activateOfficial.emit(official);
  }

  onDeactivate(official: Official): void {
    this.deactivateOfficial.emit(official);
  }

  onStartTracking(official: Official): void {
    this.startTrackingOfficial.emit(official);
  }

  onStopTracking(official: Official): void {
    this.stopTrackingOfficial.emit(official);
  }
}
