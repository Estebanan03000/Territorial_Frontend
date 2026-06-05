import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from 'src/environments/environments';
import { Category } from 'src/app/models/category';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss',
})
export class CategoryFormComponent implements OnInit {
  @Input() category: Category | null = null;
  @Input() categories: Category[] = [];
  @Input() buttonText = 'Guardar categoría';
  @Input() loading = false;

  @Output() formSubmit = new EventEmitter<{ category: Partial<Category>; file?: File }>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;
  selectedFile?: File;
  previewUrl?: string;
  currentImageUrl?: string;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [this.category?.name ?? '', Validators.required],
      description: [this.category?.description ?? ''],
      id_parent_category: [this.category?.id_parent_category ?? null],
      status: [this.category?.status ?? 'Activo', Validators.required],
    });

    if (this.category?.image_url) {
      this.currentImageUrl = `${environment.apiUrl}${this.category.image_url}`;
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
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
      category: this.form.value,
      file: this.selectedFile,
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
