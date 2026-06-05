import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { Commune } from '../../../../models/commune';
import { City } from '../../../../models/city';
import { Department } from '../../../../models/department';
import { Neighborhood } from '../../../../models/neighborhood';
import { StatusBadgeComponent } from '../../../../components/shared/status-badge/status-badge.component';

@Component({
  selector: 'app-commune-table',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    StatusBadgeComponent,
  ],
  templateUrl: './commune-table.component.html',
  styleUrl: './commune-table.component.scss',
})
export class CommuneTableComponent {
  @Input() communes: Commune[] = [];
  @Input() cities: City[] = [];
  @Input() departments: Department[] = [];
  @Input() neighborhoods: Neighborhood[] = [];
  @Input() loading = false;

  @Output() editCommune = new EventEmitter<number>();
  @Output() deleteCommune = new EventEmitter<Commune>();
  @Output() activateCommune = new EventEmitter<Commune>();
  @Output() deactivateCommune = new EventEmitter<Commune>();
  @Output() viewNeighborhoods = new EventEmitter<Commune>();

  getCity(idCity?: number): City | undefined {
    return this.cities.find((city) => city.id_city === idCity);
  }

  getCityName(idCity?: number): string {
    const city = this.getCity(idCity);
    return city?.name || 'Sin ciudad';
  }

  getDepartmentName(idCity?: number): string {
    const city = this.getCity(idCity);

    if (!city) {
      return 'Sin departamento';
    }

    const department = this.departments.find(
      (item) => item.id_department === city.id_department
    );

    return department?.name || 'Sin departamento';
  }

  getNeighborhoodCount(commune: Commune): number {
    return this.neighborhoods.filter(
      (item) => item.id_commune === commune.id_commune
    ).length;
  }

  isActive(commune: Commune): boolean {
    return commune.status === 'activo' || commune.status === 'activa';
  }

  onEdit(commune: Commune): void {
    if (commune.id_commune) {
      this.editCommune.emit(commune.id_commune);
    }
  }

  onDelete(commune: Commune): void {
    this.deleteCommune.emit(commune);
  }

  onActivate(commune: Commune): void {
    this.activateCommune.emit(commune);
  }

  onDeactivate(commune: Commune): void {
    this.deactivateCommune.emit(commune);
  }

  onViewNeighborhoods(commune: Commune): void {
    this.viewNeighborhoods.emit(commune);
  }
}