import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnDestroy,
  Output
} from '@angular/core';

import * as L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: 'assets/leaflet/marker-icon.png',
  iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
  shadowUrl: 'assets/leaflet/marker-shadow.png',
});

@Component({
  selector: 'app-annotation-location-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './annotation-location-picker.component.html',
  styleUrl: './annotation-location-picker.component.scss',
})
export class AnnotationLocationPickerComponent
  implements AfterViewInit, OnDestroy {

  @Output()
  locationSelected = new EventEmitter<{
    latitude: number;
    longitude: number;
  }>();

  private map?: L.Map;

  private marker?: L.Marker;

  ngAfterViewInit(): void {

    setTimeout(() => {

      this.initMap();

    }, 0);

  }

  ngOnDestroy(): void {

    if (this.map) {

      this.map.remove();

    }

  }

  private initMap(): void {

    this.map = L.map(
      'annotation-location-map'
    ).setView(
      [5.0703, -75.5138],
      13
    );

    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution:
          '© OpenStreetMap contributors',
      }
    ).addTo(this.map);

    this.map.on(
      'click',
      (event: L.LeafletMouseEvent) => {

        const lat =
          event.latlng.lat;

        const lng =
          event.latlng.lng;

        this.placeMarker(
          lat,
          lng
        );

        this.locationSelected.emit({
          latitude: lat,
          longitude: lng
        });

      }
    );

  }

  private placeMarker(
    lat: number,
    lng: number
  ): void {

    if (!this.map) {
      return;
    }

    if (this.marker) {

      this.map.removeLayer(
        this.marker
      );

    }

    this.marker = L.marker([
      lat,
      lng
    ]).addTo(this.map);

  }

}
