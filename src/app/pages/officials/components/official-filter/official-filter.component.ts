import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Entity } from '../../../../models/entity';
import { OfficialFilters } from '../../../../models/official';

@Component({
  selector: 'app-official-filter',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './official-filter.component.html',
  styleUrl: './official-filter.component.scss',
})
export class OfficialFilterComponent implements OnInit {
  @Input() entities: Entity[] = [];
  @Output() filterChange = new EventEmitter<OfficialFilters>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      q: [''],
      id_entity: [''],
      status: [''],
    });
  }

  onSearch(): void {
    const value = this.form.value;
    const filters: OfficialFilters = {};

    if (value.q && value.q.trim() !== '') {
      filters.q = value.q.trim();
    }

    if (value.id_entity !== '') {
      filters.id_entity = Number(value.id_entity);
    }

    if (value.status !== '') {
      filters.status = value.status;
    }

    this.filterChange.emit(filters);
  }

  onClear(): void {
    this.form.reset({
      q: '',
      id_entity: '',
      status: '',
    });

    this.filterChange.emit({});
  }
}
