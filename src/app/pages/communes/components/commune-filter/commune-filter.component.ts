import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { CommuneFilters } from '../../../../models/commune';
import {
  TerritorySelectComponent,
  TerritorySelection,
} from '../../../../components/shared/territory-select/territory-select.component';

@Component({
  selector: 'app-commune-filter',
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
  templateUrl: './commune-filter.component.html',
  styleUrl: './commune-filter.component.scss',
})
export class CommuneFilterComponent implements OnInit {
  @Output() filterChange = new EventEmitter<CommuneFilters>();

  form!: FormGroup;

  selectedDepartmentId?: number;
  selectedCityId?: number;
  clearSignal = 0;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      q: [''],
      status: [''],
    });
  }

  onTerritoryChange(selection: TerritorySelection): void {
    this.selectedDepartmentId = selection.id_department;
    this.selectedCityId = selection.id_city;
  }

  onSearch(): void {
    const value = this.form.value;

    const filters: CommuneFilters = {};

    if (value.q && value.q.trim() !== '') {
      filters.q = value.q.trim();
    }

    if (this.selectedDepartmentId) {
      filters.id_department = this.selectedDepartmentId;
    }

    if (this.selectedCityId) {
      filters.id_city = this.selectedCityId;
    }

    if (value.status && value.status !== '') {
      filters.status = value.status;
    }

    this.filterChange.emit(filters);
  }

  onClear(): void {
    this.form.reset({
      q: '',
      status: '',
    });

    this.selectedDepartmentId = undefined;
    this.selectedCityId = undefined;
    this.clearSignal++;

    this.filterChange.emit({});
  }
}