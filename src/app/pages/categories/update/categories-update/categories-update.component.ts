import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { Category } from 'src/app/models/category';
import { CategoriesService } from 'src/app/services/categories.service';
import { CategoryFormComponent } from '../../components/category-form/category-form.component';

@Component({
  selector: 'app-categories-update',
  standalone: true,
  imports: [CategoryFormComponent],
  templateUrl: './categories-update.component.html',
  styleUrl: './categories-update.component.scss'
})
export class CategoriesUpdateComponent implements OnInit {

  category?: Category;
  categories: Category[] = [];

  loading = false;
  private id!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit(): void {

    const idParam = this.route.snapshot.paramMap.get('id');

    this.id = idParam
      ? Number(idParam)
      : NaN;

    if (isNaN(this.id)) {
      this.router.navigate(['/categories/list']);
      return;
    }

    this.loadCategory();
    this.loadCategories();
  }

  loadCategory(): void {

    this.categoriesService.getById(this.id).subscribe({
      next: (category) => {
        this.category = category;
      },
      error: () => {
        this.router.navigate(['/categories/list']);
      }
    });

  }

  loadCategories(): void {

    this.categoriesService.getPaged(1, 500).subscribe({
      next: (resp) => {

        this.categories =
          (resp.items || []).filter(
            c => c.id_category !== this.id
          );

      }
    });

  }

  onUpdate(event: { category: Partial<Category>; file?: File }): void {

    this.categoriesService.getPaged(1, 500).subscribe({
      next: (resp) => {
        const allCategories = resp.items || [];

        const currentName = this.normalizeText(event.category.name);
        const currentParent = this.normalizeParent(event.category.id_parent_category);

        const duplicated = allCategories.some((item) => {
          const itemName = this.normalizeText(item.name);
          const itemParent = this.normalizeParent(item.id_parent_category);

          return (
            item.id_category !== this.id &&
            itemName === currentName &&
            itemParent === currentParent
          );
        });

        if (duplicated) {
          Swal.fire(
            'Categoría duplicada',
            'Ya existe una categoría con ese nombre dentro del mismo padre.',
            'warning'
          );
          return;
        }

        this.updateCategory(event);
      },
      error: () => {
        Swal.fire(
          'Error',
          'No se pudo validar si la categoría ya existe.',
          'error'
        );
      }
    });
  }

  private normalizeText(value?: string | null): string {
    return (value || '').trim().toLowerCase();
  }

  private normalizeParent(value?: number | string | null): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    return Number(value);
  }

  private updateCategory(event: { category: Partial<Category>; file?: File }): void {
    this.loading = true;

    const request = event.file
      ? this.categoriesService.updateWithFile(this.id, event.category, event.file)
      : this.categoriesService.update(this.id, event.category);

    request.subscribe({
      next: () => {
        this.loading = false;
        Swal.fire('Actualizada', 'La categoría fue actualizada.', 'success');
        this.router.navigate(['/categories/list']);
      },
      error: (error: any) => {
        this.loading = false;
        Swal.fire(
          'Error',
          error?.error?.message || 'No se pudo actualizar.',
          'error'
        );
      }
    });
  }

  onCancel(): void {

    this.router.navigate([
      '/categories/list'
    ]);

  }

}
