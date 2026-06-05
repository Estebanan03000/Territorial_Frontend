import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { Neighborhood } from 'src/app/models/neighborhood';
import { Commune } from 'src/app/models/commune';

import { NeighborhoodsService } from 'src/app/services/neighborhoods.service';
import { CommunesService } from 'src/app/services/communes.service';
import { PointsService } from 'src/app/services/points.service';
import { AnnotationsService } from 'src/app/services/annotations.service';

import { DynamicTableComponent } from 'src/app/components/ui/table/dynamic-table/dynamic-table.component';
import { ColumnDef } from 'src/app/models/component-dynamic-table/column-def';
import { ActionButton } from 'src/app/models/component-dynamic-table/action-button';
import { TablePageEvent } from 'src/app/models/component-dynamic-table/table-page-event';

import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';

type NeighborhoodRow = Neighborhood & {
  communeName?: string;
  pointsCount?: number;
  annotationsCount?: number;
};

@Component({
  selector: 'app-neighborhoods-list',
  standalone: true,
  imports: [CommonModule, RouterLink, DynamicTableComponent],
  templateUrl: './neighborhoods-list.component.html',
  styleUrl: './neighborhoods-list.component.scss'
})
export class NeighborhoodsListComponent implements OnInit {

  neighborhoods: NeighborhoodRow[] = [];
  communes: Commune[] = [];

  loading = false;

  page = 1;
  pageSize = 5;
  total = 0;
  totalPages = 1;

  columns: ColumnDef[] = [
    { header: 'Barrio', key: 'name' },
    { header: 'Comuna', key: 'communeName' },
    { header: 'Puntos', key: 'pointsCount' },
    { header: 'Anotaciones', key: 'annotationsCount' },
    { header: 'Estado', key: 'status' },
  ];

  actions: ActionButton[] = [
    {
      id: 'edit',
      label: 'Editar',
      class: 'mr-2 px-2 py-1 rounded bg-yellow-400 text-black'
    },
    {
      id: 'delete',
      label: 'Eliminar',
      class: 'mr-2 px-2 py-1 rounded bg-red-500 text-white'
    }
  ];

  constructor(
    private neighborhoodsService: NeighborhoodsService,
    private communesService: CommunesService,
    private pointsService: PointsService,
    private annotationsService: AnnotationsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.loading = true;

    this.communesService.getAll().subscribe({
      next: (communes) => {
        this.communes = communes || [];
        this.loadNeighborhoods();
      },
      error: (error: any) => {
        console.error('ERROR COMUNAS:', error);
        this.communes = [];
        this.loadNeighborhoods();
      }
    });
  }

  loadNeighborhoods(page = this.page, pageSize = this.pageSize): void {
    this.loading = true;

    this.neighborhoodsService.getPaged(page, pageSize).subscribe({
      next: (resp) => {
        const items = resp.items || [];

        this.neighborhoods = items.map((neighborhood) => ({
          ...neighborhood,
          communeName: this.getCommuneName(neighborhood.id_commune),
          pointsCount: 0,
          annotationsCount: 0,
        }));

        this.page = page;
        this.pageSize = pageSize;
        this.total = resp.totalItems ?? this.neighborhoods.length;
        this.totalPages = resp.totalPages ?? Math.max(1, Math.ceil(this.total / this.pageSize));

        this.loadCounters();
        this.loading = false;
      },
      error: (error: any) => {
        console.error('ERROR BARRIOS:', error);
        this.neighborhoods = [];
        this.total = 0;
        this.totalPages = 1;
        this.loading = false;
      }
    });
  }

  getCommuneName(idCommune?: number): string {
    const commune = this.communes.find((item) => item.id_commune === idCommune);
    return commune?.name || 'Sin comuna';
  }

  loadCounters(): void {
    this.neighborhoods.forEach((neighborhood) => {
      const id = neighborhood.id_neighborhood;

      if (!id) return;

      this.pointsService.search({ id_neighborhood: id }, 1, 100).subscribe({
        next: (resp) => {
          neighborhood.pointsCount = resp.totalItems ?? resp.items?.length ?? 0;
        },
        error: (error: any) => {
          console.error('ERROR PUNTOS:', error);
          neighborhood.pointsCount = 0;
        }
      });

      this.annotationsService.search({ id_neighborhood: id }, 1, 100).subscribe({
        next: (resp) => {
          neighborhood.annotationsCount = resp.totalItems ?? resp.items?.length ?? 0;
        },
        error: (error: any) => {
          console.error('ERROR ANOTACIONES:', error);
          neighborhood.annotationsCount = 0;
        }
      });
    });
  }

  onPageChange(event: TablePageEvent): void {
    this.page = event.page;
    this.pageSize = event.pageSize;
    this.loadNeighborhoods(this.page, this.pageSize);
  }

  onTableAction(event: { actionId: string; row: NeighborhoodRow }): void {
    const { actionId, row } = event;

    if (actionId === 'edit') {
      this.router.navigate([`/neighborhoods/update/${row.id_neighborhood}`]);
    }

    if (actionId === 'delete') {
      this.tryDeleteNeighborhood(row);
    }
  }

  tryDeleteNeighborhood(neighborhood: NeighborhoodRow): void {
    const id = neighborhood.id_neighborhood;

    if (!id) {
      Swal.fire('Error', 'No se encontró el identificador del barrio.', 'error');
      return;
    }

    forkJoin({
      points: this.pointsService.search({ id_neighborhood: id }, 1, 100),
      annotations: this.annotationsService.search({ id_neighborhood: id }, 1, 100)
    }).subscribe({
      next: ({ points, annotations }) => {
        const pointsCount = points.totalItems ?? points.items?.length ?? 0;
        const annotationsCount = annotations.totalItems ?? annotations.items?.length ?? 0;

        if (pointsCount > 0 || annotationsCount > 0) {
          Swal.fire({
            title: 'No se puede eliminar',
            html: `
              El barrio tiene dependientes asociados:<br><br>
              <b>Puntos:</b> ${pointsCount}<br>
              <b>Anotaciones:</b> ${annotationsCount}
            `,
            icon: 'warning',
            confirmButtonText: 'Entendido'
          });

          return;
        }

        Swal.fire({
          title: '¿Estás seguro?',
          text: `¿Quieres eliminar el barrio "${neighborhood.name}"?`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.neighborhoodsService.delete(id).subscribe({
              next: () => {
                Swal.fire('Eliminado', 'Barrio eliminado correctamente.', 'success');
                this.loadNeighborhoods();
              },
              error: (error: any) => {
                Swal.fire('Error', this.getErrorMessage(error), 'error');
              }
            });
          }
        });
      },
      error: (error: any) => {
        Swal.fire(
          'Error',
          'No se pudieron verificar los puntos y anotaciones asociados al barrio.',
          'error'
        );
      }
    });
  }

  getErrorMessage(error: any): string {
    return error?.error?.message || 'No fue posible completar la operación.';
  }
}