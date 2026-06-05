import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

import { Commune } from 'src/app/models/commune';
import { Neighborhood } from 'src/app/models/neighborhood';

import { CommunesService } from 'src/app/services/communes.service';
import { NeighborhoodsService } from 'src/app/services/neighborhoods.service';

import { NeighborhoodFormComponent } from '../components/neighborhood-form/neighborhood-form.component';

@Component({
  selector: 'app-create-neighborhood',
  standalone: true,
  imports: [CommonModule, NeighborhoodFormComponent],
  templateUrl: './create-neighborhood.component.html',
  styleUrl: './create-neighborhood.component.scss'
})
export class CreateNeighborhoodComponent implements OnInit {

  communes: Commune[] = [];
  neighborhoods: Neighborhood[] = [];

  loading = false;

  constructor(
    private router: Router,
    private communesService: CommunesService,
    private neighborhoodsService: NeighborhoodsService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
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
  }

  onCreate(formValue: Partial<Neighborhood>): void {
    if (this.existsNeighborhoodInCommune(formValue)) {
      Swal.fire({
        title: 'Nombre duplicado',
        text: `Ya existe un barrio llamado "${formValue.name}" en la comuna seleccionada.`,
        icon: 'error',
        confirmButtonText: 'Entendido'
      });

      return;
    }

    this.loading = true;

    this.neighborhoodsService.create(formValue).subscribe({
      next: () => {
        this.loading = false;

        Swal.fire({
          title: 'Barrio creado',
          text: `El barrio "${formValue.name}" se creó correctamente.`,
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
      return Number(neighborhood.id_commune) === idCommune &&
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
    return error?.error?.message || 'No fue posible crear el barrio.';
  }
}