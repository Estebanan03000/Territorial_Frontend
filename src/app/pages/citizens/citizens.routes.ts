import { Routes } from '@angular/router';
import { CitizensListComponent } from './list/citizens-list.component';
import { CreateCitizenComponent } from './create/create-citizen.component';
import { UpdateCitizenComponent } from './update/update-citizen.component';
import { DetailCitizenComponent } from './detail/detail-citizen.component';

export const CitizensRoutes: Routes = [
  {
    path: 'list',
    component: CitizensListComponent
  },
  {
    path: 'create',
    component: CreateCitizenComponent
  },
  {
    path: 'update/:id',
    component: UpdateCitizenComponent
  },
  {
    path: 'detail/:id',
    component: DetailCitizenComponent
  }
];