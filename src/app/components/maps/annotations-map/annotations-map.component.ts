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

import * as L from 'leaflet';

import { AnnotationMapItem, AnnotationMapViewMode } from 'src/app/models/annotation-map-item';
import { Point } from 'src/app/models/point';

@Component({
  selector: 'app-annotations-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './annotations-map.component.html',
  styleUrl: './annotations-map.component.scss',
})
export class AnnotationsMapComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() items: AnnotationMapItem[] = [];
  @Input() selectedItem?: AnnotationMapItem;
  @Input() viewMode: AnnotationMapViewMode = 'markers';
  @Input() points: Point[] = [];
  @Input() selectedNeighborhoodId?: number;

  @Output() annotationSelected = new EventEmitter<AnnotationMapItem>();

  private map?: L.Map;
  private markerLayer = L.layerGroup();
  private areaLayer = L.layerGroup();
  private mapReady = false;

  ngAfterViewInit(): void {
    setTimeout(() => this.initMap(), 0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.mapReady) {
      return;
    }

    if (changes['items'] || changes['viewMode'] || changes['selectedItem']) {
      this.drawAnnotations();
    }

    if (changes['points'] || changes['selectedNeighborhoodId']) {
      this.drawNeighborhoodArea();
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap(): void {
    this.map = L.map('annotations-map').setView([5.0703, -75.5138], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    this.markerLayer.addTo(this.map);
    this.areaLayer.addTo(this.map);
    this.mapReady = true;
    this.drawAnnotations();
    this.drawNeighborhoodArea();
  }

  private drawAnnotations(): void {
    if (!this.map) {
      return;
    }

    this.markerLayer.clearLayers();

    const validItems = this.items.filter(
      (item) => item.annotation.latitude !== undefined && item.annotation.longitude !== undefined
    );

    validItems.forEach((item) => {
      const lat = Number(item.annotation.latitude);
      const lng = Number(item.annotation.longitude);
      const color = this.getCategoryColor(item);
      const isSelected = item.annotation.id_annotation === this.selectedItem?.annotation.id_annotation;

      if (this.viewMode === 'heat') {
        const circle = L.circle([lat, lng], {
          radius: isSelected ? 130 : 90,
          color,
          fillColor: color,
          fillOpacity: isSelected ? 0.45 : 0.25,
          weight: isSelected ? 3 : 1,
        });

        circle.on('click', () => this.annotationSelected.emit(item));
        circle.addTo(this.markerLayer);
        return;
      }

      const marker = L.marker([lat, lng], {
        icon: this.createMarkerIcon(color, isSelected),
      });

      marker.bindPopup(this.getPopupText(item));
      marker.on('click', () => this.annotationSelected.emit(item));
      marker.addTo(this.markerLayer);
    });

    if (this.selectedItem?.annotation.latitude && this.selectedItem?.annotation.longitude) {
      this.focusAnnotation(this.selectedItem);
    } else if (validItems.length > 0) {
      const group = L.featureGroup(this.markerLayer.getLayers() as L.Layer[]);
      this.map.fitBounds(group.getBounds(), { padding: [30, 30] });
    }
  }

  private drawNeighborhoodArea(): void {
    if (!this.map) {
      return;
    }

    this.areaLayer.clearLayers();

    if (!this.selectedNeighborhoodId) {
      return;
    }

    const areaPoints = this.points
      .filter((point) => point.id_neighborhood === this.selectedNeighborhoodId)
      .sort((a, b) => Number(a.order || 0) - Number(b.order || 0));

    if (areaPoints.length < 3) {
      return;
    }

    const coordinates = areaPoints.map((point) => [Number(point.latitude), Number(point.longitude)] as L.LatLngTuple);

    L.polygon(coordinates, {
      color: '#2563eb',
      fillColor: '#bfdbfe',
      fillOpacity: 0.15,
      weight: 2,
    }).addTo(this.areaLayer);
  }

  focusAnnotation(item: AnnotationMapItem): void {
    if (!this.map || !item.annotation.latitude || !item.annotation.longitude) {
      return;
    }

    this.map.setView([Number(item.annotation.latitude), Number(item.annotation.longitude)], 16);
  }

  private createMarkerIcon(color: string, selected: boolean): L.DivIcon {
    const size = selected ? 34 : 26;

    return L.divIcon({
      className: '',
      html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 3px 10px rgba(15,23,42,.35);"></div>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  }

  private getPopupText(item: AnnotationMapItem): string {
    const category = item.subcategory?.name || item.mainCategory?.name || 'Sin categoría';
    const place = item.neighborhood?.name || 'Sin barrio';
    const rating = item.voteCount > 0 ? item.averageRating.toFixed(1) : 'Sin calificación';

    return `<strong>${category}</strong><br>${place}<br>Calificación: ${rating}`;
  }

  private getCategoryColor(item: AnnotationMapItem): string {
    const categoryId = item.mainCategory?.id_category || item.subcategory?.id_category || 0;
    const colors = ['#2563eb', '#16a34a', '#f97316', '#dc2626', '#7c3aed', '#0891b2', '#4b5563'];
    return colors[categoryId % colors.length];
  }
}
