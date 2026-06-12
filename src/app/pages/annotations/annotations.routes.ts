import { Routes } from '@angular/router';
import { AnnotationsCreateComponent } from './create/annotations-create/annotations-create.component';
import { AnnotationsListComponent } from './list/annotations-list/annotations-list.component';
import { AnnotationsUpdateComponent } from './update/annotations-update/annotations-update.component';

export const AnnotationsRoutes: Routes = [
  {
    path: 'list',
    component: AnnotationsListComponent
  },
  {
    path: 'create',
    component: AnnotationsCreateComponent
  },
  {
    path: 'update/:id',
    component: AnnotationsUpdateComponent
  }
];
