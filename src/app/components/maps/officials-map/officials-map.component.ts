import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';

import { Official } from 'src/app/models/official';
import * as L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'assets/leaflet/marker-icon.png',
  iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
  shadowUrl: 'assets/leaflet/marker-shadow.png',
});

@Component({
  selector: 'app-officials-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './officials-map.component.html',
  styleUrl: './officials-map.component.scss',
})
export class OfficialsMapComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() officials: Official[] = [];
  @Input() selectedOfficialId?: number;
  @Input() mapId = 'officials-tracking-map';
  @Input() centerLat = 5.0703;
  @Input() centerLng = -75.5138;
  @Input() zoom = 13;

  @Output() officialSelected = new EventEmitter<Official>();

  private map?: L.Map;
  private markers: L.Marker[] = [];
  private mapReady = false;

  ngAfterViewInit(): void {
    setTimeout(() => this.initMap(), 0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.mapReady) {
      return;
    }

    if (changes['officials'] || changes['selectedOfficialId']) {
      this.paintOfficials();
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = undefined;
    }
  }

  private initMap(): void {
    const container = document.getElementById(this.mapId);

    if (!container || this.mapReady) {
      return;
    }

    this.map = L.map(this.mapId).setView([this.centerLat, this.centerLng], this.zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    this.mapReady = true;
    this.paintOfficials();
  }

  private paintOfficials(): void {
    if (!this.map) {
      return;
    }

    this.clearMarkers();

    const locatedOfficials = this.officials.filter((official) => this.hasLocation(official));

    locatedOfficials.forEach((official) => {
      const marker = L.marker(
        [Number(official.last_latitude), Number(official.last_longitude)],
        {
          icon: this.createOfficialIcon(official),
        }
      ).addTo(this.map as L.Map);

      marker.bindPopup(this.getPopupText(official));
      marker.on('click', () => this.officialSelected.emit(official));
      this.markers.push(marker);
    });

    if (locatedOfficials.length > 0) {
      const group = L.featureGroup(this.markers);
      this.map.fitBounds(group.getBounds().pad(0.2));
    }
  }

  private clearMarkers(): void {
    if (!this.map) {
      return;
    }

    this.markers.forEach((marker) => this.map?.removeLayer(marker));
    this.markers = [];
  }

  private hasLocation(official: Official): boolean {
    return official.last_latitude !== null &&
      official.last_latitude !== undefined &&
      official.last_longitude !== null &&
      official.last_longitude !== undefined;
  }

  private createOfficialIcon(official: Official): L.DivIcon {
    const statusClass = this.getStatusClass(official);
    const selectedClass = official.id_official === this.selectedOfficialId ? 'selected' : '';
    const initials = this.getInitials(official.name || 'F');

    return L.divIcon({
      className: 'official-marker-container',
      html: `<div class="official-marker ${statusClass} ${selectedClass}">${initials}</div>`,
      iconSize: [42, 42],
      iconAnchor: [21, 21],
      popupAnchor: [0, -18],
    });
  }

  private getStatusClass(official: Official): string {
    if (!this.hasLocation(official)) {
      return 'offline';
    }

    if (official.gps_active) {
      return 'online';
    }

    return 'last-known';
  }

  private getInitials(name: string): string {
    return name
      .split(' ')
      .filter((part) => part.trim() !== '')
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join('');
  }

  private getPopupText(official: Official): string {
    const status = official.gps_active ? 'En línea' : 'Última posición conocida';
    const update = official.last_gps_update || 'Sin actualización';

    return `
      <strong>${official.name || 'Funcionario'}</strong><br>
      ${status}<br>
      ${update}
    `;
  }
}
