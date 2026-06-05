import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { Category } from 'src/app/models/category';
import { CategoriesService } from 'src/app/services/categories.service';
import { CategoryFormComponent } from '../../components/category-form/category-form.component';

@Component({
  selector: 'app-categories-create',
  standalone: true,
  imports: [CategoryFormComponent],
  templateUrl: './categories-create.component.html',
  styleUrl: './categories-create.component.scss',
})
export class CategoriesCreateComponent implements OnInit {
  categories: Category[] = [];
  loading = false;

  constructor(
    private router: Router,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoriesService.getPaged(1, 100).subscribe({
      next: (resp) => {
        this.categories = resp.items || [];
      },
      error: () => {
        this.categories = [];
      }
    });
  }

  onCreate(event: { category: Partial<Category>; file?: File }): void {
    if (this.existsCategory(event.category)) {
      Swal.fire(
        'Categoría duplicada',
        'Ya existe una categoría con ese nombre dentro del mismo padre.',
        'warning'
      );
      return;
    }

    this.loading = true;

    const request = event.file
      ? this.categoriesService.createWithFile(event.category, event.file)
      : this.categoriesService.create(event.category);

    request.subscribe({
      next: () => {
        this.loading = false;
        Swal.fire('Creada', 'La categoría fue creada correctamente.', 'success');
        this.router.navigate(['/categories/list']);
      },
      error: (error: any) => {
        this.loading = false;
        Swal.fire(
          'Error',
          error?.error?.message || 'No se pudo crear la categoría.',
          'error'
        );
      }
    });
  }

  existsCategory(category: Partial<Category>): boolean {
    const name = category.name?.trim().toLowerCase();
    const parentId = category.id_parent_category || null;

    return this.categories.some((item) => {
      const itemName = item.name?.trim().toLowerCase();
      const itemParentId = item.id_parent_category || null;

      return itemName === name && itemParentId === parentId;
    });
  }

  onCancel(): void {
    this.router.navigate(['/categories/list']);
  }
}
