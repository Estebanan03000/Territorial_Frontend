import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Entity } from 'src/app/models/entity';

@Component({
  selector: 'app-tracking-entity-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tracking-entity-filter.component.html',
  styleUrl: './tracking-entity-filter.component.scss',
})
export class TrackingEntityFilterComponent {
  @Input() entities: Entity[] = [];
  @Input() selectedEntityId = '';

  @Output() entityChange = new EventEmitter<number | undefined>();

  onEntityChange(): void {
    const value = this.selectedEntityId ? Number(this.selectedEntityId) : undefined;
    this.entityChange.emit(value);
  }
}
