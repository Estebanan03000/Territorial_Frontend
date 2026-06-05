import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { Commune, CommunePayload } from '../../../../models/commune';
import {
  TerritorySelectComponent,
  TerritorySelection,
} from '../../../../components/shared/territory-select/territory-select.component';

@Component({
  selector: 'app-commune-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    TerritorySelectComponent,
  ],
  templateUrl: './commune-form.component.html',
  styleUrl: './commune-form.component.scss',
})
export class CommuneFormComponent implements OnInit {
  @Input() commune?: Commune;

  @Output() formSubmit = new EventEmitter<CommunePayload>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;
  isEditMode = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.isEditMode = !!this.commune;
    this.createForm();
  }

  get f() {
    return this.form.controls;
  }

  createForm(): void {
    this.form = this.fb.group({
      id_city: [this.commune?.id_city || '', Validators.required],
      name: [this.commune?.name || '', [Validators.required, Validators.minLength(3)]],
      status: [this.commune?.status || 'activo', Validators.required],
    });
  }

  onTerritoryChange(selection: TerritorySelection): void {
    this.form.patchValue({
      id_city: selection.id_city || '',
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: CommunePayload = {
      id_city: Number(this.form.value.id_city),
      name: this.form.value.name.trim(),
      status: this.form.value.status,
    };

    this.formSubmit.emit(payload);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}