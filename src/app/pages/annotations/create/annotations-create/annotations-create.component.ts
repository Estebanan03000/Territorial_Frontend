import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { Annotation } from 'src/app/models/annotation';
import { Neighborhood } from 'src/app/models/neighborhood';

import { AnnotationsService } from 'src/app/services/annotations.service';
import { NeighborhoodsService } from 'src/app/services/neighborhoods.service';

import { AnnotationFormComponent } from 'src/app/components/annotation-form/annotation-form.component';
import { AnnotationLocationPickerComponent } from 'src/app/components/annotation-location-picker/annotation-location-picker.component';
import { AnnotationImageService } from 'src/app/services/annotation-image.service';

@Component({
  selector: 'app-annotations-create',
  standalone: true,
  imports: [
    AnnotationFormComponent,
    AnnotationLocationPickerComponent
  ],
  templateUrl: './annotations-create.component.html',
  styleUrl: './annotations-create.component.scss',
})
export class AnnotationsCreateComponent implements OnInit {

  neighborhoods: Neighborhood[] = [];

  selectedLatitude?: number;

  selectedLongitude?: number;

  private pendingImage?: string;

  constructor(
    private router: Router,
    private annotationsService: AnnotationsService,
    private neighborhoodsService: NeighborhoodsService,
    private annotationImageService: AnnotationImageService
  ) {}

  ngOnInit(): void {

    this.loadNeighborhoods();

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

  onCreate(annotation: Partial<Annotation>): void {

    const payload: Partial<Annotation> = {

      ...annotation,

      id_citizen: 1,

      status: annotation.status || 'Activo'

    };

    this.annotationsService.create(payload).subscribe({

      next: (annotation: any) => {

        if (
          this.pendingImage &&
          annotation?.id_annotation
        ) {

          this.annotationImageService
            .saveImage(
              annotation.id_annotation,
              this.pendingImage
            );

        }

        Swal.fire(
          'Creada',
          'La anotación fue registrada correctamente.',
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
            'No fue posible guardar la anotación.',
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

  onLocationSelected(
    event: {
      latitude: number;
      longitude: number;
    }
  ): void {

    this.selectedLatitude =
      event.latitude;

    this.selectedLongitude =
      event.longitude;

  }

  onImageSelected(
    image: string
  ): void {

    this.pendingImage = image;

  }
}
