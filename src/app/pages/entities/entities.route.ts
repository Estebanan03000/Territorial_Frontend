import { Routes } from '@angular/router';
import { ListComponent } from './list/entities-list.component';
import { CreateComponent } from './create/entities-create.component';
import { UpdateComponent } from './update/entities-update.component';

export const EntitiesRoutes: Routes = [
  {
    path: 'list',
    component: ListComponent
  },
  {
    path: 'create',
    component: CreateComponent
  },
  {
    path: 'update/:id',
    component: UpdateComponent
  }
];
