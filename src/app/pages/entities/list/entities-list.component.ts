import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import Swal from 'sweetalert2';

import { Entity } from 'src/app/models/entity';
import { EntitiesService } from 'src/app/services/entities.service';
import { OfficialsService } from 'src/app/services/officials.service';

import { DynamicTableComponent } from 'src/app/components/ui/table/dynamic-table/dynamic-table.component';
import { ColumnDef } from 'src/app/models/component-dynamic-table/column-def';
import { ActionButton } from 'src/app/models/component-dynamic-table/action-button';
import { TablePageEvent } from 'src/app/models/component-dynamic-table/table-page-event';

import { environment } from 'src/environments/environments';

@Component({
  selector: 'app-entities-list',
  standalone: true,
  imports: [CommonModule, RouterLink, DynamicTableComponent],
  templateUrl: './entities-list.component.html',
  styleUrl: './entities-list.component.scss'
})
export class ListComponent implements OnInit {

  entities: Entity[] = [];
  loading = false;

  page = 1;
  pageSize = 5;
  total = 0;
  totalPages = 1;

  columns: ColumnDef[] = [
    { header: 'Logo', key: 'logo_url'},
    { header: 'Nombre', key: 'name' },
    { header: 'NIT', key: 'nit' },
    { header: 'Correo', key: 'email' },
    { header: 'Teléfono', key: 'phone' },
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
    private entitiesService: EntitiesService,
    private officialsService: OfficialsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEntities();
  }

  loadEntities(page = this.page, pageSize = this.pageSize): void {

    this.loading = true;

    this.entitiesService.getPaged(page, pageSize).subscribe({
      next: (resp) => {

        this.entities = resp.items || [];
        this.page = page;
        this.pageSize = pageSize;

        this.total = resp.totalItems ?? this.entities.length;

        this.totalPages =
          resp.totalPages ??
          Math.max(1, Math.ceil(this.total / this.pageSize));

        this.loading = false;
      },
      error: (error) => {

        console.error(error);

        this.entities = [];
        this.total = 0;
        this.totalPages = 1;
        this.loading = false;
      }
    });
  }

  onPageChange(event: TablePageEvent): void {

    this.page = event.page;
    this.pageSize = event.pageSize;

    this.loadEntities(
      this.page,
      this.pageSize
    );
  }

  onTableAction(event: { actionId: string; row: Entity }): void {

    const { actionId, row } = event;

    if (actionId === 'edit') {
      this.router.navigate([
        `/entities/update/${row.id_entity}`
      ]);
    }

    if (actionId === 'delete') {
      this.deleteEntity(row);
    }
  }

  getLogoUrl(entity: Entity): string {

    if (!entity.logo_url) {
      return 'assets/images/no-image.png';
    }

    return `${environment.apiUrl}${entity.logo_url}`;
  }

  deleteEntity(entity: Entity): void {
    if (!entity.id_entity) {
      return;
    }

    this.officialsService.search(
      { id_entity: entity.id_entity } as any,
      1,
      1
    ).subscribe({
      next: (resp) => {
        const hasOfficials = (resp.totalItems ?? 0) > 0;

        if (hasOfficials) {
          Swal.fire(
            'No se puede eliminar',
            `La entidad "${entity.name}" tiene funcionarios asociados.`,
            'warning'
          );
          return;
        }

        this.confirmDelete(entity);
      },
      error: () => {
        Swal.fire(
          'Error',
          'No se pudo validar si la entidad tiene funcionarios asociados.',
          'error'
        );
      }
    });
  }

  confirmDelete(entity: Entity): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Quieres eliminar la entidad "${entity.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.entitiesService.delete(entity.id_entity || 0).subscribe({
          next: () => {
            Swal.fire(
              'Eliminado',
              'Entidad eliminada correctamente.',
              'success'
            );

            this.loadEntities();
          },
          error: (error) => {
            Swal.fire(
              'Error',
              error?.error?.message || 'No se pudo eliminar la entidad.',
              'error'
            );
          }
        });
      }
    });
  }
}
