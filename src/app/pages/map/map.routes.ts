import { Routes } from '@angular/router';

import { AnnotationsMapPageComponent } from './annotations-map/annotations-map.component';
import { RealTimeTrackingComponent } from './real-time-tracking/real-time-tracking.component';

export const MapRoutes: Routes = [
  {
    path: '',
    redirectTo: 'tracking',
    pathMatch: 'full',
  },
  {
    path: 'annotations',
    component: AnnotationsMapPageComponent,
  },
  {
    path: 'tracking',
    component: RealTimeTrackingComponent,
  },
];
