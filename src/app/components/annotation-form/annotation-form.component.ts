import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Neighborhood } from 'src/app/models/neighborhood';
import { Annotation } from 'src/app/models/annotation';

@Component({
  selector: 'app-annotation-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './annotation-form.component.html',
  styleUrl: './annotation-form.component.scss',
})
export class AnnotationFormComponent implements OnChanges {

  selectedFile?: File;

  previewUrl?: string;

  @Input()
  existingImage?: string;

  @Input() annotation?: Partial<Annotation>;

  @Input() neighborhoods: Neighborhood[] = [];

  @Input() latitude?: number;

  @Input() longitude?: number;

  @Output() formSubmit =
    new EventEmitter<Partial<Annotation>>();

  @Output() cancel =
    new EventEmitter<void>();

  @Output() imageSelected =
    new EventEmitter<string>();

  form: FormGroup;

  constructor(
    private fb: FormBuilder
  ) {

    this.form = this.fb.group({
      description: ['', Validators.required],

      id_neighborhood: [null],

      latitude: ['', Validators.required],

      longitude: ['', Validators.required],

      status: ['Activo']
    });

  }

  ngOnChanges(
    changes: SimpleChanges
  ): void {

    if (
      this.existingImage &&
      !this.previewUrl
    ) {

      this.previewUrl =
        this.existingImage;

    }

    if (
      this.latitude !== undefined &&
      this.longitude !== undefined
    ) {

      this.form.patchValue({
        latitude: this.latitude,
        longitude: this.longitude
      });

    }

    if (this.annotation) {

      this.form.patchValue(this.annotation);

    }

  }

  submit(): void {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;

    }

    this.formSubmit.emit(
      this.form.value
    );

  }

  onCancel(): void {

    this.cancel.emit();

  }

  onFileSelected(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    const file =
      input.files?.[0];

    if (!file) {
      return;
    }

    this.selectedFile = file;

    const reader =
      new FileReader();

    reader.onload = () => {

      const result =
        reader.result as string;

      this.previewUrl = result;

      this.imageSelected.emit(
        result
      );

    };

    reader.readAsDataURL(file);

  }

}
