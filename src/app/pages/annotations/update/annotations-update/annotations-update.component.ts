import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { Annotation } from 'src/app/models/annotation';
import { Neighborhood } from 'src/app/models/neighborhood';

import { AnnotationsService } from 'src/app/services/annotations.service';
import { NeighborhoodsService } from 'src/app/services/neighborhoods.service';

import { AnnotationFormComponent } from 'src/app/components/annotation-form/annotation-form.component';
import { AnnotationImageService } from 'src/app/services/annotation-image.service';

@Component({
  selector: 'app-annotations-update',
  standalone: true,
  imports: [AnnotationFormComponent],
  templateUrl: './annotations-update.component.html',
  styleUrl: './annotations-update.component.scss',
})
export class AnnotationsUpdateComponent implements OnInit {

  annotation?: Annotation;

  neighborhoods: Neighborhood[] = [];

  annotationId = 0;

  savedImage?: string;

  private pendingImage?: string;

  onImageSelected(image: string): void {
    this.pendingImage = image;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private annotationsService: AnnotationsService,
    private neighborhoodsService: NeighborhoodsService,
    private annotationImageService: AnnotationImageService
  ) {}

  ngOnInit(): void {

    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    if (!id) {

      this.router.navigate([
        '/annotations/list'
      ]);

      return;
    }

    this.annotationId = id;

    this.loadNeighborhoods();
    this.loadAnnotation();

  }

  loadNeighborhoods(): void {

    this.neighborhoodsService.getAll().subscribe({

      next: (data) => {

        this.neighborhoods = data || [];

      },

      error: () => {

        this.neighborhoods = [];

      }

    });

  }

  loadAnnotation(): void {

    this.savedImage =
      this.annotationImageService
        .getImage(
          this.annotationId
        ) || undefined;

    this.annotationsService
      .getById(this.annotationId)
      .subscribe({

        next: (data) => {

          this.annotation = data;

        },

        error: () => {

          Swal.fire(
            'Error',
            'No fue posible cargar la anotación.',
            'error'
          );

          this.router.navigate([
            '/annotations/list'
          ]);

        }

      });

  }

  onUpdate(
    annotation: Partial<Annotation>
  ): void {

    const payload: Partial<Annotation> = {

      ...annotation,

      id_citizen:
        this.annotation?.id_citizen || 1

    };

    this.annotationsService
      .update(
        this.annotationId,
        payload
      )
      .subscribe({

        next: () => {

          if (this.pendingImage) {
            this.annotationImageService.saveImage(
              this.annotationId,
              this.pendingImage
            );
          }
          
          Swal.fire(
            'Actualizada',
            'La anotación fue actualizada correctamente.',
            'success'
          );

          this.router.navigate([
            '/annotations/list'
          ]);

        },

        error: (error: any) => {

          Swal.fire(
            'Error',
            error?.error?.message ||
              'No fue posible actualizar.',
            'error'
          );

        }

      });

  }

  onCancel(): void {

    this.router.navigate([
      '/annotations/list'
    ]);

  }

}
