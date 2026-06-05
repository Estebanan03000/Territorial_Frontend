import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

import { Category } from 'src/app/models/category';
import { CategoriesService } from 'src/app/services/categories.service';

import { DynamicTableComponent } from 'src/app/components/ui/table/dynamic-table/dynamic-table.component';
import { ColumnDef } from 'src/app/models/component-dynamic-table/column-def';
import { ActionButton } from 'src/app/models/component-dynamic-table/action-button';
import { TablePageEvent } from 'src/app/models/component-dynamic-table/table-page-event';

interface CategoryRow extends Category {
  type?: string;
  parentName?: string;
}

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [CommonModule, RouterLink, DynamicTableComponent],
  templateUrl: './categories-list.component.html',
  styleUrl: './categories-list.component.scss'
})

export class CategoriesListComponent implements OnInit {

  categories: CategoryRow[] = [];
  loading = false;

  page = 1;
  pageSize = 5;
  total = 0;
  totalPages = 1;

  allCategories: Category[] = [];

  columns: ColumnDef[] = [
    { header: 'Nombre', key: 'name' },
    { header: 'Tipo', key: 'type' },
    { header: 'Categoría Padre', key: 'parentName' },
    { header: 'Estado', key: 'status' }
  ];

  actions: ActionButton[] = [
    {
      id: 'edit',
      label: 'Editar',
      class: 'mr-2 px-2 py-1 rounded bg-yellow-400 text-black'
    },
    {
      id: 'delete',
      label: 'Eliminar',
      class: 'mr-2 px-2 py-1 rounded bg-red-500 text-white'
    }
  ];

  constructor(
    private categoriesService: CategoriesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAllCategories();
  }

  loadCategories(page = this.page, pageSize = this.pageSize): void {

    this.loading = true;

    this.categoriesService.getPaged(page, pageSize).subscribe({
      next: (resp) => {

        const items = resp.items || [];

        this.categories = items.map(category => {

          const parent = this.allCategories.find(
            p => p.id_category === category.id_parent_category
          );

          return {
            ...category,
            type: category.id_parent_category
              ? 'Subcategoría'
              : 'Categoría',
            parentName: parent?.name || '-'
          };

        });

        this.page = page;
        this.pageSize = pageSize;
        this.total = resp.totalItems ?? 0;
        this.totalPages = resp.totalPages ?? 1;

        this.loading = false;
      },
      error: () => {

        this.categories = [];
        this.loading = false;

      }
    });
  }

  loadAllCategories(): void {

    this.categoriesService.getPaged(1, 500).subscribe({
      next: (resp) => {

        this.allCategories = resp.items || [];

        this.loadCategories();

      }
    });

  }

  onPageChange(event: TablePageEvent): void {

    this.page = event.page;
    this.pageSize = event.pageSize;

    this.loadCategories(
      this.page,
      this.pageSize
    );

  }

  onTableAction(event: { actionId: string; row: Category }): void {

    if (event.actionId === 'edit') {
      this.router.navigate([
        `/categories/update/${event.row.id_category}`
      ]);
    }

    if (event.actionId === 'delete') {
      this.deleteCategory(event.row);
    }

  }

  deleteCategory(category: Category): void {

    const hasChildren = this.allCategories.some(
      item => item.id_parent_category === category.id_category
    );

    if (hasChildren) {

      Swal.fire(
        'No permitido',
        'La categoría tiene subcategorías asociadas.',
        'warning'
      );

      return;
    }

    Swal.fire({
      title: '¿Eliminar categoría?',
      text: category.name,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar'
    }).then(result => {

      if (!result.isConfirmed) {
        return;
      }

      this.categoriesService.delete(
        category.id_category || 0
      ).subscribe({
        next: () => {

          Swal.fire(
            'Eliminada',
            'La categoría fue eliminada.',
            'success'
          );

          this.loadCategories();
          this.loadAllCategories();
        }
      });

    });

  }
}
