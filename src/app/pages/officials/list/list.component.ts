import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Entity } from '../../../models/entity';
import { Official, OfficialFilters } from '../../../models/official';
import { EntitiesService } from '../../../services/entities.service';
import { OfficialsService } from '../../../services/officials.service';
import { OfficialFilterComponent } from '../components/official-filter/official-filter.component';
import { OfficialTableComponent } from '../components/official-table/official-table.component';

@Component({
  selector: 'app-officials-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    OfficialFilterComponent,
    OfficialTableComponent,
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent implements OnInit {
  officials: Official[] = [];
  entities: Entity[] = [];
  loading = false;

  page = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 0;

  filters: OfficialFilters = {};

  constructor(
    private officialsService: OfficialsService,
    private entitiesService: EntitiesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEntities();
    this.loadOfficials();
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

    this.officialsService.search(this.filters, this.page, this.pageSize).subscribe({
      next: (response) => {
        this.officials = response.items;
        this.totalItems = response.totalItems;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: (error: any) => {
        this.officials = [];
        this.loading = false;

        Swal.fire('Error', this.getErrorMessage(error), 'error');
      },
    });
  }

  onFilter(filters: OfficialFilters): void {
    this.filters = filters;
    this.page = 1;
    this.loadOfficials();
  }

  goToCreate(): void {
    this.router.navigate(['/officials/create']);
  }

  goToUpdate(id: number): void {
    this.router.navigate(['/officials/update', id]);
  }

  deleteOfficial(official: Official): void {
    Swal.fire({
      title: 'Eliminar funcionario',
      text: 'Esta acción eliminará el registro seleccionado.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed && official.id_official) {
        this.officialsService.delete(official.id_official).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'El funcionario fue eliminado correctamente.', 'success');
            this.loadOfficials();
          },
          error: (error: any) => {
            Swal.fire('Error', this.getErrorMessage(error), 'error');
          },
        });
      }
    });
  }

  activateOfficial(official: Official): void {
    this.changeStatus(official, 'activo');
  }

  deactivateOfficial(official: Official): void {
    this.changeStatus(official, 'inactivo');
  }

  changeStatus(official: Official, status: string): void {

    if (!official.id_official) {
      return;
    }

    this.officialsService.update(
      official.id_official,
      {
        ...official,
        status
      }
    ).subscribe({

      next: () => {

        Swal.fire(
          'Actualizado',
          'El estado del funcionario fue actualizado.',
          'success'
        );

        this.loadOfficials();
      },

      error: (error: any) => {

        Swal.fire(
          'Error',
          this.getErrorMessage(error),
          'error'
        );
      }
    });
  }

  startTracking(official: Official): void {
    if (!official.id_official) {
      return;
    }

    this.officialsService.startTracking([official.id_official]).subscribe({
      next: () => {
        Swal.fire('Actualizado', 'El seguimiento GPS fue activado.', 'success');
        this.loadOfficials();
      },
      error: (error: any) => {
        Swal.fire('Error', this.getErrorMessage(error), 'error');
      },
    });
  }

  stopTracking(official: Official): void {
    if (!official.id_official) {
      return;
    }

    this.officialsService.stopTracking([official.id_official]).subscribe({
      next: () => {
        Swal.fire('Actualizado', 'El seguimiento GPS fue detenido.', 'success');
        this.loadOfficials();
      },
      error: (error: any) => {
        Swal.fire('Error', this.getErrorMessage(error), 'error');
      },
    });
  }

  previousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadOfficials();
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadOfficials();
    }
  }

  getErrorMessage(error: any): string {
    return error?.error?.message || 'No fue posible completar la operación.';
  }
}
