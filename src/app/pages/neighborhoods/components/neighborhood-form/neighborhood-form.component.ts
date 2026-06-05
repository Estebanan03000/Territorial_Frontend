import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Commune } from 'src/app/models/commune';
import { Neighborhood } from 'src/app/models/neighborhood';

@Component({
  selector: 'app-neighborhood-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './neighborhood-form.component.html',
  styleUrl: './neighborhood-form.component.scss'
})
export class NeighborhoodFormComponent implements OnInit {

  @Input() neighborhood?: Neighborhood;
  @Input() communes: Commune[] = [];
  @Input() buttonText = 'Guardar barrio';
  @Input() loading = false;

  @Output() formSubmit = new EventEmitter<Partial<Neighborhood>>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id_commune: [this.neighborhood?.id_commune ?? '', Validators.required],
      name: [this.neighborhood?.name ?? '', Validators.required],
      status: [this.neighborhood?.status ?? 'active', Validators.required],
    });
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!control && control.invalid && control.touched;
  }
  
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: Partial<Neighborhood> = {
      id_commune: Number(this.form.value.id_commune),
      name: String(this.form.value.name).trim(),
      status: this.form.value.status
    };

    this.formSubmit.emit(payload);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}