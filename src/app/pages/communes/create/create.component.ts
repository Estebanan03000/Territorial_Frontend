import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { CommunePayload } from '../../../models/commune';
import { CommunesService } from '../../../services/communes.service';
import { CommuneFormComponent } from '../components/commune-form/commune-form.component';

@Component({
  selector: 'app-communes-create',
  standalone: true,
  imports: [
    CommonModule,
    CommuneFormComponent,
  ],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
})
export class CreateComponent {
  constructor(
    private communesService: CommunesService,
    private router: Router
  ) {}

  createCommune(payload: CommunePayload): void {
    this.communesService.create(payload).subscribe({
      next: () => {
        Swal.fire('Creada', 'La comuna fue creada correctamente.', 'success');
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
    return error?.error?.message || 'No fue posible crear la comuna.';
  }
}