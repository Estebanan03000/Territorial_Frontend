import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import Swal from 'sweetalert2';

import { Commune } from 'src/app/models/commune';
import { Neighborhood } from 'src/app/models/neighborhood';

import { CommunesService } from 'src/app/services/communes.service';
import { NeighborhoodsService } from 'src/app/services/neighborhoods.service';

import { NeighborhoodFormComponent } from '../components/neighborhood-form/neighborhood-form.component';

@Component({
  selector: 'app-update-neighborhood',
  standalone: true,
  imports: [CommonModule, NeighborhoodFormComponent],
  templateUrl: './update-neighborhood.component.html',
  styleUrl: './update-neighborhood.component.scss'
})
export class UpdateNeighborhoodComponent implements OnInit {

  neighborhood?: Neighborhood;
  communes: Commune[] = [];
  neighborhoods: Neighborhood[] = [];

  loading = false;
  private id!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private communesService: CommunesService,
    private neighborhoodsService: NeighborhoodsService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id = idParam ? Number(idParam) : NaN;

    if (isNaN(this.id)) {
      this.router.navigate(['/neighborhoods/list']);
      return;
    }

    this.loadData();
  }

  loadData(): void {
    this.loading = true;

    this.communesService.getAll().subscribe({
      next: (communes) => {
        this.communes = communes || [];
      },
      error: () => {
        this.communes = [];
        Swal.fire('Error', 'No se pudieron cargar las comunas.', 'error');
      }
    });

    this.neighborhoodsService.getAll().subscribe({
      next: (neighborhoods) => {
        this.neighborhoods = neighborhoods || [];
      },
      error: () => {
        this.neighborhoods = [];
      }
    });

    this.neighborhoodsService.getById(this.id).subscribe({
      next: (neighborhood) => {
        this.neighborhood = neighborhood;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        Swal.fire('Error', 'No se pudo cargar el barrio.', 'error').then(() => {
          this.router.navigate(['/neighborhoods/list']);
        });
      }
    });
  }

  onUpdate(formValue: Partial<Neighborhood>): void {
    if (this.existsNeighborhoodInCommune(formValue)) {
      Swal.fire({
        title: 'Nombre duplicado',
        text: `Ya existe otro barrio llamado "${formValue.name}" en la comuna seleccionada.`,
        icon: 'error',
        confirmButtonText: 'Entendido'
      });

      return;
    }

    this.loading = true;

    this.neighborhoodsService.update(this.id, formValue).subscribe({
      next: () => {
        this.loading = false;

        Swal.fire({
          title: 'Barrio actualizado',
          text: `El barrio "${formValue.name}" se actualizó correctamente.`,
          icon: 'success',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.router.navigate(['/neighborhoods/list']);
        });
      },
      error: (error: any) => {
        this.loading = false;
        Swal.fire('Error', this.getErrorMessage(error), 'error');
      }
    });
  }

  existsNeighborhoodInCommune(formValue: Partial<Neighborhood>): boolean {
    const name = this.normalizeText(formValue.name);
    const idCommune = Number(formValue.id_commune);

    return this.neighborhoods.some((neighborhood) => {
      const isSameNeighborhood = Number(neighborhood.id_neighborhood) === this.id;

      return !isSameNeighborhood &&
        Number(neighborhood.id_commune) === idCommune &&
        this.normalizeText(neighborhood.name) === name;
    });
  }

  normalizeText(value?: string | null): string {
    return String(value || '')
      .trim()
      .toLowerCase();
  }

  onCancel(): void {
    this.router.navigate(['/neighborhoods/list']);
  }

  getErrorMessage(error: any): string {
    return error?.error?.message || 'No fue posible actualizar el barrio.';
  }
}