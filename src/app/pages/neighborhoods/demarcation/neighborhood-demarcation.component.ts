import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import Swal from 'sweetalert2';
import * as L from 'leaflet';
import { forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Commune } from 'src/app/models/commune';
import { Neighborhood } from 'src/app/models/neighborhood';
import { Point } from 'src/app/models/point';

import { CommunesService } from 'src/app/services/communes.service';
import { NeighborhoodsService } from 'src/app/services/neighborhoods.service';
import { PointsService } from 'src/app/services/points.service';

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: 'assets/leaflet/marker-icon.png',
  iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
  shadowUrl: 'assets/leaflet/marker-shadow.png'
});

type PolygonPoint = {
  id_point?: number;
  latitude: number;
  longitude: number;
  order: number;
};

@Component({
  selector: 'app-neighborhood-demarcation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './neighborhood-demarcation.component.html',
  styleUrl: './neighborhood-demarcation.component.scss'
})
export class NeighborhoodDemarcationComponent implements OnInit, AfterViewInit, OnDestroy {

  communes: Commune[] = [];
  neighborhoods: Neighborhood[] = [];
  filteredNeighborhoods: Neighborhood[] = [];

  selectedCommuneId = '';
  searchText = '';

  selectedNeighborhood?: Neighborhood;

  polygonPoints: PolygonPoint[] = [];
  originalPolygonPoints: PolygonPoint[] = [];
  hasUnsavedChanges = false;

  loading = false;
  saving = false;

  private map?: L.Map;
  private markers: L.Marker[] = [];
  private polygon?: L.Polygon;

  readonly manizalesCenter: L.LatLngExpression = [5.0703, -75.5138];

  constructor(
    private communesService: CommunesService,
    private neighborhoodsService: NeighborhoodsService,
    private pointsService: PointsService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.initMap(), 0);
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  loadData(): void {
    this.loading = true;

    this.communesService.getAll().subscribe({
      next: (communes) => {
        this.communes = communes || [];

        this.neighborhoodsService.getAll().subscribe({
          next: (neighborhoods) => {
            this.neighborhoods = neighborhoods || [];
            this.applyFilters();
            this.loading = false;
          },
          error: () => {
            this.neighborhoods = [];
            this.filteredNeighborhoods = [];
            this.loading = false;
            Swal.fire('Error', 'No se pudieron cargar los barrios.', 'error');
          }
        });
      },
      error: () => {
        this.communes = [];
        this.loading = false;
        Swal.fire('Error', 'No se pudieron cargar las comunas.', 'error');
      }
    });
  }

  initMap(): void {
    if (this.map) return;

    this.map = L.map('demarcation-map').setView(this.manizalesCenter, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', (event: L.LeafletMouseEvent) => {
      if (!this.selectedNeighborhood) {
        Swal.fire('Selecciona un barrio', 'Primero debes seleccionar un barrio.', 'info');
        return;
      }

      this.addPoint(event.latlng.lat, event.latlng.lng);
    });
  }

  applyFilters(): void {
    const search = this.normalize(this.searchText);
    const communeId = this.selectedCommuneId ? Number(this.selectedCommuneId) : null;

    this.filteredNeighborhoods = this.neighborhoods.filter((neighborhood) => {
      const matchesSearch = !search || this.normalize(neighborhood.name).includes(search);
      const matchesCommune = !communeId || Number(neighborhood.id_commune) === communeId;

      return matchesSearch && matchesCommune;
    });
  }

  selectNeighborhood(neighborhood: Neighborhood): void {
    if (this.hasUnsavedChanges) {
      Swal.fire({
        title: 'Cambios sin guardar',
        text: 'Si cambias de barrio, se perderán los cambios no guardados. ¿Deseas continuar?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, cambiar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.selectedNeighborhood = neighborhood;
          this.loadNeighborhoodPoints(neighborhood);
        }
      });

      return;
    }

    this.selectedNeighborhood = neighborhood;
    this.loadNeighborhoodPoints(neighborhood);
  }

  loadNeighborhoodPoints(neighborhood: Neighborhood): void {
    const id = neighborhood.id_neighborhood;

    if (!id) return;

    this.loading = true;

    this.pointsService.search({ id_neighborhood: id }, 1, 300).subscribe({
      next: (response) => {
        const points = response.items || [];

        this.polygonPoints = points
          .sort((a, b) => Number(a.order || 0) - Number(b.order || 0))
          .map((point, index) => ({
            id_point: point.id_point,
            latitude: Number(point.latitude),
            longitude: Number(point.longitude),
            order: Number(point.order || index + 1)
          }));

        this.originalPolygonPoints = this.polygonPoints.map((point) => ({ ...point }));
        this.hasUnsavedChanges = false;

        this.redrawPolygon();

        if (this.polygonPoints.length > 0 && this.map) {
          const bounds = L.latLngBounds(
            this.polygonPoints.map((point) => [point.latitude, point.longitude] as L.LatLngExpression)
          );

          this.map.fitBounds(bounds, {
            padding: [40, 40]
          });
        }

        this.loading = false;
      },
      error: () => {
        this.polygonPoints = [];
        this.originalPolygonPoints = [];
        this.hasUnsavedChanges = false;
        this.redrawPolygon();
        this.loading = false;
      }
    });
  }

  addPoint(latitude: number, longitude: number): void {
    this.polygonPoints.push({
      latitude,
      longitude,
      order: this.polygonPoints.length + 1
    });

    this.hasUnsavedChanges = true;
    this.redrawPolygon();
  }

  removeLastPoint(): void {
    if (this.polygonPoints.length === 0) {
      Swal.fire('Sin puntos', 'No hay puntos para eliminar.', 'info');
      return;
    }

    this.polygonPoints.pop();
    this.reorderPoints();
    this.hasUnsavedChanges = true;
    this.redrawPolygon();
  }

  clearPoints(): void {
    if (this.polygonPoints.length === 0) {
      Swal.fire('Sin puntos', 'No hay puntos para limpiar.', 'info');
      return;
    }

    Swal.fire({
      title: 'Limpiar puntos',
      text: 'Se quitarán todos los puntos del polígono en pantalla. Para que el cambio sea definitivo debes guardar.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, limpiar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.polygonPoints = [];
        this.hasUnsavedChanges = true;
        this.redrawPolygon();
      }
    });
  }

  cancelChanges(): void {
    if (!this.hasUnsavedChanges) {
      Swal.fire('Sin cambios', 'No hay cambios pendientes por cancelar.', 'info');
      return;
    }

    Swal.fire({
      title: 'Cancelar cambios',
      text: 'Se restaurará el último polígono guardado.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, restaurar',
      cancelButtonText: 'No cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.polygonPoints = this.originalPolygonPoints.map((point) => ({ ...point }));
        this.hasUnsavedChanges = false;
        this.redrawPolygon();
      }
    });
  }

  redrawPolygon(): void {
    if (!this.map) return;

    this.markers.forEach((marker) => marker.remove());
    this.markers = [];

    if (this.polygon) {
      this.polygon.remove();
      this.polygon = undefined;
    }

    this.polygonPoints.forEach((point, index) => {
      const marker = L.marker([point.latitude, point.longitude], {
        draggable: true
      }).addTo(this.map!);

      marker.bindTooltip(String(index + 1), {
        permanent: true,
        direction: 'top',
        className: 'point-label'
      });

      marker.on('dragend', () => {
        const position = marker.getLatLng();

        this.polygonPoints[index] = {
          ...this.polygonPoints[index],
          latitude: position.lat,
          longitude: position.lng
        };

        this.hasUnsavedChanges = true;
        this.redrawPolygon();
      });

      this.markers.push(marker);
    });

    if (this.polygonPoints.length >= 2) {
      const latLngs = this.polygonPoints.map((point) => [point.latitude, point.longitude] as L.LatLngExpression);

      this.polygon = L.polygon(latLngs, {
        color: '#2563eb',
        weight: 3,
        fillColor: '#3b82f6',
        fillOpacity: 0.2
      }).addTo(this.map);
    }
  }

  savePolygon(): void {
    if (!this.selectedNeighborhood?.id_neighborhood) {
      Swal.fire('Selecciona un barrio', 'Debes seleccionar un barrio antes de guardar.', 'info');
      return;
    }

    if (this.polygonPoints.length < 3) {
      Swal.fire(
        'Polígono incompleto',
        'Debes agregar al menos 3 puntos para formar un polígono.',
        'warning'
      );
      return;
    }

    const idNeighborhood = this.selectedNeighborhood.id_neighborhood;

    this.saving = true;

    this.pointsService.search({ id_neighborhood: idNeighborhood }, 1, 300).pipe(
      switchMap((response) => {
        const existingPoints = response.items || [];

        const deleteRequests = existingPoints
          .filter((point) => !!point.id_point)
          .map((point) => this.pointsService.delete(Number(point.id_point)));

        if (deleteRequests.length === 0) {
          return of([]);
        }

        return forkJoin(deleteRequests);
      }),
      switchMap(() => {
        const createRequests = this.polygonPoints.map((point, index) => {
          const payload: Partial<Point> = {
            id_neighborhood: idNeighborhood,
            id_annotation: null,
            latitude: point.latitude,
            longitude: point.longitude,
            order: index + 1,
            point_type: 'neighborhood_polygon'
          };

          return this.pointsService.create(payload);
        });

        return forkJoin(createRequests);
      })
    ).subscribe({
      next: () => {
        this.saving = false;
        this.originalPolygonPoints = this.polygonPoints.map((point) => ({ ...point }));
        this.hasUnsavedChanges = false;

        Swal.fire({
          title: 'Polígono guardado',
          text: `El polígono quedó asociado al barrio "${this.selectedNeighborhood?.name}".`,
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });

        if (this.selectedNeighborhood) {
          this.loadNeighborhoodPoints(this.selectedNeighborhood);
        }
      },
      error: (error: any) => {
        this.saving = false;
        Swal.fire('Error', this.getErrorMessage(error), 'error');
      }
    });
  }

  getCommuneName(idCommune?: number): string {
    const commune = this.communes.find((item) => Number(item.id_commune) === Number(idCommune));
    return commune?.name || 'Sin comuna';
  }

  normalize(value?: string | null): string {
    return String(value || '').trim().toLowerCase();
  }

  reorderPoints(): void {
    this.polygonPoints = this.polygonPoints.map((point, index) => ({
      ...point,
      order: index + 1
    }));
  }

  getErrorMessage(error: any): string {
    return error?.error?.message || 'No fue posible guardar el polígono.';
  }
}