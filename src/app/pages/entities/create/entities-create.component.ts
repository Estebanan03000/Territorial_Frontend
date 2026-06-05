import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Entity } from 'src/app/models/entity';
import { EntitiesService } from 'src/app/services/entities.service';
import { EntityFormComponent } from '../component/entity-form/entity-form.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-entity',
  standalone: true,
  imports: [EntityFormComponent],
  templateUrl: './entities-create.component.html',
  styleUrl: './entities-create.component.scss'
})
export class CreateComponent {

  loading = false;

  constructor(
    private router: Router,
    private entitiesService: EntitiesService
  ) {}

  onCreate(event: { entity: Partial<Entity>, file?: File }): void {

    this.loading = true;

    const request = event.file
      ? this.entitiesService.createWithFile(event.entity, event.file)
      : this.entitiesService.create(event.entity);

    request.subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/entities/list']);
      },
      error: (error: any) => {

        this.loading = false;

        Swal.fire({
          icon: 'error',
          title: 'No se pudo guardar',
          text:
            error?.error?.message ||
            'Ocurrió un error inesperado'
        });

      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/entities/list']);
  }
}
