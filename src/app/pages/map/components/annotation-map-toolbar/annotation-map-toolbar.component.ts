import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { AnnotationMapFilters, AnnotationMapViewMode } from 'src/app/models/annotation-map-item';
import { Commune } from 'src/app/models/commune';
import { Neighborhood } from 'src/app/models/neighborhood';

@Component({
  selector: 'app-annotation-map-toolbar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  templateUrl: './annotation-map-toolbar.component.html',
  styleUrl: './annotation-map-toolbar.component.scss',
})
export class AnnotationMapToolbarComponent implements OnInit, OnChanges {
  @Input() communes: Commune[] = [];
  @Input() neighborhoods: Neighborhood[] = [];
  @Input() categoryIds: number[] = [];
  @Input() viewMode: AnnotationMapViewMode = 'markers';

  @Output() filtersChange = new EventEmitter<AnnotationMapFilters>();
  @Output() refresh = new EventEmitter<void>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id_commune: [''],
      id_neighborhood: [''],
      search: [''],
    });

    this.form.valueChanges.subscribe(() => this.emitFilters());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['categoryIds'] && this.form) {
      this.emitFilters();
    }
  }

  get filteredNeighborhoods(): Neighborhood[] {
    const idCommune = this.form?.value?.id_commune;

    if (!idCommune) {
      return this.neighborhoods;
    }

    return this.neighborhoods.filter((item) => item.id_commune === Number(idCommune));
  }

  changeCommune(): void {
    this.form.patchValue({ id_neighborhood: '' }, { emitEvent: false });
    this.emitFilters();
  }

  setViewMode(mode: AnnotationMapViewMode): void {
    this.viewMode = mode;
    this.emitFilters();
  }

  clear(): void {
    this.form.reset({
      id_commune: '',
      id_neighborhood: '',
      search: '',
    });

    this.emitFilters();
  }

  emitFilters(): void {
    if (!this.form) {
      return;
    }

    const value = this.form.value;

    this.filtersChange.emit({
      id_commune: value.id_commune ? Number(value.id_commune) : undefined,
      id_neighborhood: value.id_neighborhood ? Number(value.id_neighborhood) : undefined,
      search: value.search || '',
      categoryIds: this.categoryIds,
      viewMode: this.viewMode,
    });
  }

  refreshData(): void {
    this.refresh.emit();
  }
}
