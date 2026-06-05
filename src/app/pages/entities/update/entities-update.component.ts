import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Entity } from 'src/app/models/entity';
import { EntitiesService } from 'src/app/services/entities.service';
import { EntityFormComponent } from '../component/entity-form/entity-form.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-entity',
  standalone: true,
  imports: [EntityFormComponent],
  templateUrl: './entities-update.component.html',
  styleUrl: './entities-update.component.scss'
})
export class UpdateComponent implements OnInit {

  entity?: Entity;
  loading = false;
  private id!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private entitiesService: EntitiesService
  ) {}

  ngOnInit(): void {

    const idParam = this.route.snapshot.paramMap.get('id');

    this.id = idParam ? Number(idParam) : NaN;

    if (isNaN(this.id)) {
      this.router.navigate(['/entities/list']);
      return;
    }

    this.entitiesService.getById(this.id).subscribe({
      next: (entity) => {
        this.entity = entity;
      },
      error: () => {
        this.router.navigate(['/entities/list']);
      }
    });
  }

  onUpdate(event: { entity: Partial<Entity>, file?: File }): void {

    this.loading = true;

    const request = event.file
      ? this.entitiesService.updateWithFile(
          this.id,
          event.entity,
          event.file
        )
      : this.entitiesService.update(
          this.id,
          event.entity
        );

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
