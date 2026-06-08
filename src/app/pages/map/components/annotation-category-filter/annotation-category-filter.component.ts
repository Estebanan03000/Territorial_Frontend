import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { AnnotationCategory } from 'src/app/models/annotation-category';
import { Category } from 'src/app/models/category';

@Component({
  selector: 'app-annotation-category-filter',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './annotation-category-filter.component.html',
  styleUrl: './annotation-category-filter.component.scss',
})
export class AnnotationCategoryFilterComponent implements OnChanges {
  @Input() categories: Category[] = [];
  @Input() annotationCategories: AnnotationCategory[] = [];
  @Input() selectedCategoryIds: number[] = [];

  @Output() selectedCategoryIdsChange = new EventEmitter<number[]>();

  parentCategories: Category[] = [];

  ngOnChanges(): void {
    this.parentCategories = this.categories.filter((item) => !item.id_parent_category);
  }

  getChildren(parent: Category): Category[] {
    return this.categories.filter((item) => item.id_parent_category === parent.id_category);
  }

  isSelected(category: Category): boolean {
    return this.selectedCategoryIds.includes(Number(category.id_category));
  }

  toggleCategory(category: Category): void {
    const id = Number(category.id_category);

    if (this.selectedCategoryIds.includes(id)) {
      this.selectedCategoryIds = this.selectedCategoryIds.filter((item) => item !== id);
    } else {
      this.selectedCategoryIds = [...this.selectedCategoryIds, id];
    }

    this.selectedCategoryIdsChange.emit(this.selectedCategoryIds);
  }

  clear(): void {
    this.selectedCategoryIds = [];
    this.selectedCategoryIdsChange.emit([]);
  }

  getCount(category: Category): number {
    const ids = [Number(category.id_category), ...this.getChildren(category).map((item) => Number(item.id_category))];

    return this.annotationCategories.filter((item) => ids.includes(Number(item.id_category))).length;
  }
}
