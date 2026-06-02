import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Official, OfficialPayload } from '../../../models/official';
import { OfficialsService } from '../../../services/officials.service';
import { OfficialFormComponent } from '../components/official-form/official-form.component';

@Component({
  selector: 'app-officials-update',
  standalone: true,
  imports: [CommonModule, OfficialFormComponent],
  templateUrl: './update.component.html',
  styleUrl: './update.component.scss',
})
export class UpdateComponent implements OnInit {
  id = 0;
  official?: Official;
  loading = false;

  constructor(
    private officialsService: OfficialsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadOfficial();
  }

  loadOfficial(): void {
    this.loading = true;

    this.officialsService.getById(this.id).subscribe({
      next: (data) => {
        this.official = data;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        Swal.fire('Error', this.getErrorMessage(error), 'error');
        this.router.navigate(['/officials']);
      },
    });
  }

  save(payload: OfficialPayload): void {
    this.officialsService.update(this.id, payload).subscribe({
      next: () => {
        Swal.fire('Actualizado', 'El funcionario fue actualizado correctamente.', 'success');
        this.router.navigate(['/officials']);
      },
      error: (error) => {
        Swal.fire('Error', this.getErrorMessage(error), 'error');
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/officials']);
  }

  getErrorMessage(error: any): string {
    return error?.error?.message || 'No fue posible completar la operación.';
  }
}
