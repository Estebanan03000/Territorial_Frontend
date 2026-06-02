import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { CitizensService } from 'src/app/services/citizens.service';
import { Citizen } from 'src/app/models/citizen';

import { DynamicTableComponent } from 'src/app/components/ui/table/dynamic-table/dynamic-table.component';
import { ColumnDef } from 'src/app/models/component-dynamic-table/column-def';
import { ActionButton } from 'src/app/models/component-dynamic-table/action-button';
import { TablePageEvent } from 'src/app/models/component-dynamic-table/table-page-event';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-citizens-list',
  standalone: true,
  imports: [CommonModule, RouterLink, DynamicTableComponent],
  templateUrl: './citizens-list.component.html',
  styleUrl: './citizens-list.component.scss'
})
export class CitizensListComponent implements OnInit {

  citizens: Citizen[] = [];
  loading = false;

  page = 1;
  pageSize = 5;
  total = 0;
  totalPages = 1;

  columns: ColumnDef[] = [
    { header: 'Nombre', key: 'name' },
    { header: 'Correo electrónico', key: 'email' },
    { header: 'Celular', key: 'phone' },
    { header: 'Dirección', key: 'address' },
    { header: 'Estado', key: 'status' },
  ];

  actions: ActionButton[] = [
    {
      id: 'view',
      label: 'Ver',
      class: 'mr-2 px-2 py-1 rounded bg-blue-500 text-white'
    },
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
    private citizensService: CitizensService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCitizens();
  }

  loadCitizens(page = this.page, pageSize = this.pageSize): void {
    this.loading = true;

    console.log('PIDIENDO CIUDADANOS:', page, pageSize);

    this.citizensService.getPaged(page, pageSize).subscribe({
      next: (resp) => {
        console.log('RESPUESTA CIUDADANOS:', resp);

        this.citizens = resp.items || [];
        this.page = page;
        this.pageSize = pageSize;
        this.total = resp.totalItems ?? this.citizens.length;
        this.totalPages = resp.totalPages ?? Math.max(1, Math.ceil(this.total / this.pageSize));
        this.loading = false;
      },
      error: (error) => {
        console.error('ERROR CIUDADANOS:', error);
        this.citizens = [];
        this.total = 0;
        this.totalPages = 1;
        this.loading = false;
      }
    });
  }

  onPageChange(event: TablePageEvent): void {
    this.page = event.page;
    this.pageSize = event.pageSize;
    this.loadCitizens(this.page, this.pageSize);
  }

  onTableAction(event: { actionId: string; row: Citizen }): void {
    const { actionId, row } = event;

    if (actionId === 'view') {
      this.router.navigate([`/citizens/detail/${row.id_citizen}`]);
    }

    if (actionId === 'edit') {
      this.router.navigate([`/citizens/update/${row.id_citizen}`]);
    }

    if (actionId === 'delete') {
      this.deleteCitizen(row);
    }
  }

  deleteCitizen(citizen: Citizen): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Quieres eliminar al ciudadano "${citizen.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.citizensService.delete(citizen.id_citizen || 0).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'Ciudadano eliminado correctamente.', 'success');
            this.loadCitizens();
          }
        });
      }
    });
  }
}