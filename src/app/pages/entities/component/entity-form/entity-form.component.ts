import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Entity } from '../../../../models/entity';
import { environment } from 'src/environments/environments';

@Component({
  selector: 'app-entity-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './entity-form.component.html',
  styleUrl: './entity-form.component.scss',
})
export class EntityFormComponent implements OnInit {

  @Input() entity: Entity | null = null;
  @Input() buttonText = 'Guardar entidad';
  @Input() loading = false;

  @Output() formSubmit = new EventEmitter<{
    entity: Partial<Entity>;
    file?: File;
  }>();

  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;

  selectedFile?: File;

  previewUrl?: string;

  currentLogoUrl?: string;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      nit: [
        '',
        [
          Validators.pattern(/^[0-9]+$/)
        ]
      ],
      phone: [
        '',
        [
          Validators.pattern(/^[0-9]{7,15}$/)
        ]
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],
      address: [''],
      status: ['Activo', Validators.required]
    });

    if (this.entity?.logo_url) {
      this.currentLogoUrl =
        `${environment.apiUrl}${this.entity.logo_url}`;
    }

    if (this.entity) {
      this.form.patchValue({
        name: this.entity.name,
        nit: this.entity.nit,
        phone: this.entity.phone,
        email: this.entity.email,
        address: this.entity.address,
        status: this.entity.status
      });
    }
  }

  onFileSelected(event: Event): void {

    const input = event.target as HTMLInputElement;

    if (
      input.files &&
      input.files.length > 0
    ) {

      this.selectedFile = input.files[0];

      const reader = new FileReader();

      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };

      reader.readAsDataURL(this.selectedFile);
    }
  }

  submit(): void {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.formSubmit.emit({
      entity: this.form.value,
      file: this.selectedFile
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
