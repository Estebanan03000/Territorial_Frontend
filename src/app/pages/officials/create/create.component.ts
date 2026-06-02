import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { OfficialPayload } from '../../../models/official';
import { OfficialsService } from '../../../services/officials.service';
import { OfficialFormComponent } from '../components/official-form/official-form.component';

@Component({
  selector: 'app-officials-create',
  standalone: true,
  imports: [CommonModule, OfficialFormComponent],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
})
export class CreateComponent implements OnInit {
  entityId?: number;

  constructor(
    private officialsService: OfficialsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const entityId = this.route.snapshot.queryParamMap.get('entityId');

    if (entityId) {
      this.entityId = Number(entityId);
    }
  }

  save(payload: OfficialPayload): void {
    this.officialsService.create(payload).subscribe({
      next: () => {
        Swal.fire('Creado', 'El funcionario fue creado correctamente.', 'success');
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
    return error?.error?.message || 'No fue posible crear el funcionario.';
  }
}
