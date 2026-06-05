import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { Department } from '../../../models/department';
import { City } from '../../../models/city';
import { DepartmentsService } from '../../../services/departments.service';
import { CitiesService } from '../../../services/cities.service';

export interface TerritorySelection {
  id_department?: number;
  id_city?: number;
}

@Component({
  selector: 'app-territory-select',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './territory-select.component.html',
  styleUrl: './territory-select.component.scss',
})
export class TerritorySelectComponent implements OnInit, OnChanges {
  @Input() initialDepartmentId?: number;
  @Input() initialCityId?: number;
  @Input() clearSignal: number = 0;

  @Output() selectionChange = new EventEmitter<TerritorySelection>();

  form!: FormGroup;

  departments: Department[] = [];
  cities: City[] = [];

  constructor(
    private fb: FormBuilder,
    private departmentsService: DepartmentsService,
    private citiesService: CitiesService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.loadDepartments();
    this.loadCities();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clearSignal'] && !changes['clearSignal'].firstChange && this.form) {
      this.clear();
    }
  }

  createForm(): void {
    this.form = this.fb.group({
      id_department: [this.initialDepartmentId || ''],
      id_city: [this.initialCityId || ''],
    });
  }

  loadDepartments(): void {
    this.departmentsService.getAll().subscribe({
      next: (data) => {
        this.departments = data;
      },
      error: () => {
        this.departments = [];
      },
    });
  }

  loadCities(): void {
    this.citiesService.getAll().subscribe({
      next: (data) => {
        this.cities = data;
        this.setInitialDepartmentFromCity();
      },
      error: () => {
        this.cities = [];
      },
    });
  }

  setInitialDepartmentFromCity(): void {
    if (!this.initialCityId) {
      return;
    }

    const city = this.cities.find((item) => item.id_city === this.initialCityId);

    if (city) {
      this.form.patchValue({
        id_department: city.id_department,
        id_city: city.id_city,
      });

      this.emitSelection();
    }
  }

  get filteredCities(): City[] {
    const idDepartment = this.form?.value?.id_department;

    if (!idDepartment) {
      return this.cities;
    }

    return this.cities.filter((city) => city.id_department === Number(idDepartment));
  }

  onDepartmentChange(): void {
    this.form.patchValue({
      id_city: '',
    });

    this.emitSelection();
  }

  onCityChange(): void {
    const idCity = this.form.value.id_city;
    const city = this.cities.find((item) => item.id_city === Number(idCity));

    if (city) {
      this.form.patchValue({
        id_department: city.id_department,
      });
    }

    this.emitSelection();
  }

  emitSelection(): void {
    const value = this.form.value;

    this.selectionChange.emit({
      id_department: value.id_department ? Number(value.id_department) : undefined,
      id_city: value.id_city ? Number(value.id_city) : undefined,
    });
  }

  clear(): void {
    this.form.reset({
      id_department: '',
      id_city: '',
    });

    this.emitSelection();
  }
}