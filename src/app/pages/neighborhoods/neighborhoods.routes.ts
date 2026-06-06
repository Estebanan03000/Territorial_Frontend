import { Routes } from '@angular/router';
import { NeighborhoodsListComponent } from './list/neighborhoods-list.component';
import { CreateNeighborhoodComponent } from './create/create-neighborhood.component';
import { UpdateNeighborhoodComponent } from './update/update-neighborhood.component';
import { NeighborhoodDemarcationComponent } from './demarcation/neighborhood-demarcation.component';

export const NeighborhoodsRoutes: Routes = [
  {
    path: 'list',
    component: NeighborhoodsListComponent
  },
  {
    path: 'create',
    component: CreateNeighborhoodComponent
  },
  {
    path: 'update/:id',
    component: UpdateNeighborhoodComponent
  },
  {
    path: 'demarcation',
    component: NeighborhoodDemarcationComponent
  }
];