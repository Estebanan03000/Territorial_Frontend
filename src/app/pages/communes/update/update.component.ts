import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { Commune, CommunePayload } from '../../../models/commune';
import { CommunesService } from '../../../services/communes.service';
import { CommuneFormComponent } from '../components/commune-form/commune-form.component';

@Component({
  selector: 'app-communes-update',
  standalone: true,
  imports: [
    CommonModule,
    CommuneFormComponent,
  ],
  templateUrl: './update.component.html',
  styleUrl: './update.component.scss',
})
export class UpdateComponent implements OnInit {
  commune?: Commune;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private communesService: CommunesService
  ) {}

  ngOnInit(): void {
    this.loadCommune();
  }

  loadCommune(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.router.navigate(['/communes']);
      return;
    }

    this.loading = true;

    this.communesService.getById(id).subscribe({
      next: (data) => {
        this.commune = data;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        Swal.fire('Error', this.getErrorMessage(error), 'error');
        this.router.navigate(['/communes']);
      },
    });
  }

  updateCommune(payload: CommunePayload): void {
    if (!this.commune?.id_commune) {
      return;
    }

    this.communesService.update(this.commune.id_commune, payload).subscribe({
      next: () => {
        Swal.fire('Actualizada', 'La comuna fue actualizada correctamente.', 'success');
        this.router.navigate(['/communes']);
      },
      error: (error) => {
        Swal.fire('Error', this.getErrorMessage(error), 'error');
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/communes']);
  }

  getErrorMessage(error: any): string {
    return error?.error?.message || 'No fue posible completar la operación.';
  }
}