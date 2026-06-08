import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { Official, OfficialFilters } from 'src/app/models/official';
import { Entity } from 'src/app/models/entity';
import { TrackingSummary } from 'src/app/models/tracking-summary';

import { OfficialsService } from 'src/app/services/officials.service';
import { EntitiesService } from 'src/app/services/entities.service';

import { OfficialsMapComponent } from 'src/app/components/maps/officials-map/officials-map.component';
import { TrackingEntityFilterComponent } from '../components/tracking-entity-filter/tracking-entity-filter.component';
import { TrackingSummaryComponent } from '../components/tracking-summary/tracking-summary.component';
import { TrackingLegendComponent } from '../components/tracking-legend/tracking-legend.component';
import { OfficialTrackingListComponent } from '../components/official-tracking-list/official-tracking-list.component';

@Component({
  selector: 'app-real-time-tracking',
  standalone: true,
  imports: [
    CommonModule,
    OfficialsMapComponent,
    TrackingEntityFilterComponent,
    TrackingSummaryComponent,
    TrackingLegendComponent,
    OfficialTrackingListComponent,
  ],
  templateUrl: './real-time-tracking.component.html',
  styleUrl: './real-time-tracking.component.scss',
})
export class RealTimeTrackingComponent implements OnInit, OnDestroy {
  entities: Entity[] = [];
  officials: Official[] = [];
  filteredOfficials: Official[] = [];
  selectedOfficial?: Official;

  selectedEntityId?: number;
  searchText = '';
  loading = false;
  lastUpdateText = 'Sin actualizar';

  summary: TrackingSummary = {
    online: 0,
    offline: 0,
    lastKnown: 0,
    total: 0,
  };

  private refreshInterval?: any;

  constructor(
    private officialsService: OfficialsService,
    private entitiesService: EntitiesService
  ) {}

  ngOnInit(): void {
    this.loadEntities();
    this.loadOfficials();
    this.startAutoRefresh();
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  loadEntities(): void {
    this.entitiesService.getAll().subscribe({
      next: (data) => {
        this.entities = data;
      },
      error: () => {
        this.entities = [];
      },
    });
  }

  loadOfficials(): void {
    this.loading = true;

    const filters: OfficialFilters = {};

    if (this.selectedEntityId) {
      filters.id_entity = this.selectedEntityId;
    }

    this.officialsService.search(filters, 1, 100).subscribe({
      next: (response) => {
        this.officials = response.items || [];
        this.applyLocalSearch();
        this.calculateSummary();
        this.setLastUpdateText();
        this.loading = false;
      },
      error: () => {
        this.officials = [];
        this.filteredOfficials = [];
        this.calculateSummary();
        this.loading = false;
      },
    });
  }

  onEntityChange(idEntity?: number): void {
    this.selectedEntityId = idEntity;
    this.selectedOfficial = undefined;
    this.loadOfficials();
  }

  onSearchChange(text: string): void {
    this.searchText = text;
    this.applyLocalSearch();
  }

  onOfficialSelected(official: Official): void {
    this.selectedOfficial = official;
  }

  refreshNow(): void {
    this.loadOfficials();
  }

  startTracking(): void {
    const ids = this.filteredOfficials
      .filter((official) => official.id_official)
      .map((official) => Number(official.id_official));

    if (ids.length === 0) {
      return;
    }

    this.officialsService.startTracking(ids).subscribe({
      next: () => this.loadOfficials(),
      error: () => this.loadOfficials(),
    });
  }

  stopTracking(): void {
    const ids = this.filteredOfficials
      .filter((official) => official.id_official)
      .map((official) => Number(official.id_official));

    if (ids.length === 0) {
      return;
    }

    this.officialsService.stopTracking(ids).subscribe({
      next: () => this.loadOfficials(),
      error: () => this.loadOfficials(),
    });
  }

  private startAutoRefresh(): void {
    this.refreshInterval = setInterval(() => {
      this.loadOfficials();
    }, 15000);
  }

  private applyLocalSearch(): void {
    const text = this.searchText.toLowerCase();

    if (!text) {
      this.filteredOfficials = this.officials;
      return;
    }

    this.filteredOfficials = this.officials.filter((official) => {
      const name = (official.name || '').toLowerCase();
      const role = (official.role || '').toLowerCase();
      const email = (official.email || '').toLowerCase();

      return name.includes(text) || role.includes(text) || email.includes(text);
    });
  }

  private calculateSummary(): void {
    const online = this.officials.filter((official) => this.isOnline(official)).length;
    const lastKnown = this.officials.filter((official) => this.isLastKnown(official)).length;
    const offline = this.officials.length - online - lastKnown;

    this.summary = {
      online,
      offline,
      lastKnown,
      total: this.officials.length,
    };
  }

  private isOnline(official: Official): boolean {
    return !!official.gps_active && this.hasLocation(official);
  }

  private isLastKnown(official: Official): boolean {
    return !official.gps_active && this.hasLocation(official);
  }

  private hasLocation(official: Official): boolean {
    return official.last_latitude !== null &&
      official.last_latitude !== undefined &&
      official.last_longitude !== null &&
      official.last_longitude !== undefined;
  }

  private setLastUpdateText(): void {
    this.lastUpdateText = new Date().toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
