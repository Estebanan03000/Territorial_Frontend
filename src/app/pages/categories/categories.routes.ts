import { Routes } from '@angular/router';
import { CategoriesListComponent } from './list/categories-list/categories-list.component';
import { CategoriesCreateComponent } from './create/categories-create/categories-create.component';
import { CategoriesUpdateComponent } from './update/categories-update/categories-update.component';

export const CategoriesRoutes: Routes = [
  {
    path: 'list',
    component: CategoriesListComponent
  },
  {
    path: 'create',
    component: CategoriesCreateComponent
  },
  {
    path: 'update/:id',
    component: CategoriesUpdateComponent
  }
];
