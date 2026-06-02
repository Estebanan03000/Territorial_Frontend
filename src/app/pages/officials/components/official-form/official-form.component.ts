import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Entity } from '../../../../../models/entity';
import { Official, OfficialPayload } from '../../../../../models/official';
import { EntitiesService } from '../../../../../services/entities.service';

@Component({
  selector: 'app-official-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './official-form.component.html',
  styleUrl: './official-form.component.scss'
})
export class OfficialFormComponent implements OnInit {
  @Input() official?: Official;
  @Input() entityId?: number;
  @Output() formSubmit = new EventEmitter<OfficialPayload>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;
  entities: Entity[] = [];
  isEditMode = false;
  loadingEntities = false;

  roleOptions = ['Administrador', 'Funcionario'];
  statusOptions = ['activo', 'inactivo'];

  constructor(
    private fb: FormBuilder,
    private entitiesService: EntitiesService
  ) {}

  ngOnInit(): void {
    this.isEditMode = !!this.official;
    this.createForm();
    this.loadEntities();
  }

  get f() {
    return this.form.controls;
  }

  createForm(): void {
    this.form = this.fb.group({
      id_entity: [this.official?.id_entity ?? this.entityId ?? '', Validators.required],
      name: [this.official?.name ?? '', Validators.required],
      email: [this.official?.email ?? '', [Validators.required, Validators.email]],
      phone: [this.official?.phone ?? '', [Validators.pattern(/^[0-9+\-\s()]{7,20}$/)]],
      role: [this.official?.role ?? 'Funcionario', Validators.required],
      status: [this.official?.status ?? 'activo', Validators.required],
      gps_active: [this.official?.gps_active ?? true]
    });
  }

  loadEntities(): void {
    this.loadingEntities = true;

    this.entitiesService.getAll().subscribe({
      next: (data) => {
        this.entities = data;
        this.loadingEntities = false;
      },
      error: () => {
        this.entities = [];
        this.loadingEntities = false;
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: OfficialPayload = {
      id_entity: Number(this.form.value.id_entity),
      name: this.form.value.name,
      email: this.form.value.email,
      phone: this.form.value.phone,
      role: this.form.value.role,
      status: this.form.value.status,
      gps_active: this.form.value.gps_active
    };

    this.formSubmit.emit(payload);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
