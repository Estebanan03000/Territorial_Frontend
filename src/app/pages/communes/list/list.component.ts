import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { Commune, CommuneFilters } from '../../../models/commune';
import { City } from '../../../models/city';
import { Department } from '../../../models/department';
import { Neighborhood } from '../../../models/neighborhood';

import { CommunesService } from '../../../services/communes.service';
import { CitiesService } from '../../../services/cities.service';
import { DepartmentsService } from '../../../services/departments.service';
import { NeighborhoodsService } from '../../../services/neighborhoods.service';

import { CommuneFilterComponent } from '../components/commune-filter/commune-filter.component';
import { CommuneTableComponent } from '../components/commune-table/commune-table.component';
import { SimplePaginatorComponent } from '../../../components/shared/simple-paginator/simple-paginator.component';

@Component({
  selector: 'app-communes-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    CommuneFilterComponent,
    CommuneTableComponent,
    SimplePaginatorComponent,
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent implements OnInit {
  communes: Commune[] = [];
  cities: City[] = [];
  departments: Department[] = [];
  neighborhoods: Neighborhood[] = [];

  loading = false;

  page = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 0;

  filters: CommuneFilters = {};

  constructor(
    private communesService: CommunesService,
    private citiesService: CitiesService,
    private departmentsService: DepartmentsService,
    private neighborhoodsService: NeighborhoodsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCatalogs();
    this.loadCommunes();
  }

  loadCatalogs(): void {
    this.departmentsService.getAll().subscribe({
      next: (data) => {
        this.departments = data;
      },
      error: () => {
        this.departments = [];
      },
    });

    this.citiesService.getAll().subscribe({
      next: (data) => {
        this.cities = data;
      },
      error: () => {
        this.cities = [];
      },
    });

    this.neighborhoodsService.getAll().subscribe({
      next: (data) => {
        this.neighborhoods = data;
      },
      error: () => {
        this.neighborhoods = [];
      },
    });
  }

  loadCommunes(): void {
    this.loading = true;

    if (this.filters.id_department && !this.filters.id_city) {
      this.loadCommunesByDepartment();
      return;
    }

    const backendFilters = this.getBackendFilters();

    this.communesService.search(backendFilters, this.page, this.pageSize).subscribe({
      next: (response) => {
        this.communes = response.items;
        this.totalItems = response.totalItems;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: (error) => {
        this.communes = [];
        this.loading = false;
        Swal.fire('Error', this.getErrorMessage(error), 'error');
      },
    });
  }

  loadCommunesByDepartment(): void {
    const backendFilters = this.getBackendFilters();

    this.communesService.search(backendFilters, 1, 1000).subscribe({
      next: (response) => {
        const cityIds = this.cities
          .filter((city) => city.id_department === this.filters.id_department)
          .map((city) => city.id_city);

        const filtered = response.items.filter((commune) =>
          cityIds.includes(commune.id_city)
        );

        this.totalItems = filtered.length;
        this.totalPages = Math.ceil(filtered.length / this.pageSize) || 1;

        const start = (this.page - 1) * this.pageSize;
        const end = start + this.pageSize;

        this.communes = filtered.slice(start, end);
        this.loading = false;
      },
      error: (error) => {
        this.communes = [];
        this.loading = false;
        Swal.fire('Error', this.getErrorMessage(error), 'error');
      },
    });
  }

  getBackendFilters(): any {
    const backendFilters: any = {};

    if (this.filters.q) {
      backendFilters.q = this.filters.q;
    }

    if (this.filters.id_city) {
      backendFilters.id_city = this.filters.id_city;
    }

    if (this.filters.status) {
      backendFilters.status = this.filters.status;
    }

    return backendFilters;
  }

  onFilter(filters: CommuneFilters): void {
    this.filters = filters;
    this.page = 1;
    this.loadCommunes();
  }

  goToCreate(): void {
    this.router.navigate(['/communes/create']);
  }

  goToUpdate(id: number): void {
    this.router.navigate(['/communes/update', id]);
  }

  deleteCommune(commune: Commune): void {
    const count = this.getNeighborhoodCount(commune);

    if (count > 0) {
      Swal.fire(
        'No se puede eliminar',
        `La comuna tiene ${count} barrio(s) asociado(s).`,
        'warning'
      );
      return;
    }

    Swal.fire({
      title: 'Eliminar comuna',
      text: 'Esta acción eliminará la comuna seleccionada.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed && commune.id_commune) {
        this.communesService.delete(commune.id_commune).subscribe({
          next: () => {
            Swal.fire('Eliminada', 'La comuna fue eliminada correctamente.', 'success');
            this.loadCommunes();
          },
          error: (error) => {
            Swal.fire('Error', this.getErrorMessage(error), 'error');
          },
        });
      }
    });
  }

  activateCommune(commune: Commune): void {
    this.changeStatus(commune, 'activo');
  }

  deactivateCommune(commune: Commune): void {
    this.changeStatus(commune, 'inactivo');
  }

  changeStatus(commune: Commune, status: string): void {
    if (!commune.id_commune) {
      return;
    }

    this.communesService.changeStatus(commune, status).subscribe({
      next: () => {
        Swal.fire('Actualizada', 'El estado de la comuna fue actualizado.', 'success');
        this.loadCommunes();
      },
      error: (error) => {
        Swal.fire('Error', this.getErrorMessage(error), 'error');
      },
    });
  }

  viewNeighborhoods(commune: Commune): void {
    const neighborhoods = this.neighborhoods.filter(
      (item) => item.id_commune === commune.id_commune
    );

    if (neighborhoods.length === 0) {
      Swal.fire('Barrios asociados', 'Esta comuna no tiene barrios asociados.', 'info');
      return;
    }

    const names = neighborhoods.map((item) => item.name).join('<br>');

    Swal.fire({
      title: 'Barrios asociados',
      html: names,
      icon: 'info',
    });
  }

  getNeighborhoodCount(commune: Commune): number {
    return this.neighborhoods.filter(
      (item) => item.id_commune === commune.id_commune
    ).length;
  }

  previousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadCommunes();
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadCommunes();
    }
  }

  getErrorMessage(error: any): string {
    return error?.error?.message || 'No fue posible completar la operación.';
  }
}