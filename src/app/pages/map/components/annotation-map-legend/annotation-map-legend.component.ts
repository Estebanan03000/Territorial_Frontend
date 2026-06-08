import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { Category } from 'src/app/models/category';

@Component({
  selector: 'app-annotation-map-legend',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './annotation-map-legend.component.html',
  styleUrl: './annotation-map-legend.component.scss',
})
export class AnnotationMapLegendComponent {
  @Input() categories: Category[] = [];

  get parentCategories(): Category[] {
    return this.categories.filter((item) => !item.id_parent_category).slice(0, 8);
  }

  getColor(category: Category): string {
    const colors = ['#2563eb', '#16a34a', '#f97316', '#dc2626', '#7c3aed', '#0891b2', '#4b5563'];
    return colors[Number(category.id_category || 0) % colors.length];
  }
}
