import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { NoAuthenticatedGuard } from './guards/no-authenticated.guard';

export const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/pages.routes').then((m) => m.PagesRoutes),
      },
      {
        path: 'ui-components',
        loadChildren: () =>
          import('./pages/ui-components/ui-components.routes').then(
            (m) => m.UiComponentsRoutes
          ),
      },
      {
        path: 'extra',
        loadChildren: () =>
          import('./pages/extra/extra.routes').then((m) => m.ExtraRoutes),
      },
      {
        path: 'users',
        canActivateChild: [AuthenticatedGuard],
        children: [
          {
            path: '',
            loadChildren: () =>import('./pages/users/users.routes').then((m) => m.UserRoutes)
          }
        ]
      },
      {
        path: 'citizens',
        canActivateChild: [AuthenticatedGuard],
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./pages/citizens/citizens.routes').then((m) => m.CitizensRoutes)
          }
        ]
      },
      {
        path: 'neighborhoods',
        canActivateChild: [AuthenticatedGuard],
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./pages/neighborhoods/neighborhoods.routes').then((m) => m.NeighborhoodsRoutes)
          }
        ]
      },
      {
        path: 'officials',
        canActivateChild: [AuthenticatedGuard],
        loadChildren: () =>
          import('./pages/officials/officials.routes').then((m) => m.OfficialsRoutes),
      },
      {
        path: 'entities',
        canActivateChild: [AuthenticatedGuard],
        loadChildren: () =>
          import('./pages/entities/entities.route').then(
            (m) => m.EntitiesRoutes
          ),
      },
      {
        path: 'categories',
        canActivateChild: [AuthenticatedGuard],
        loadChildren: () =>
          import('./pages/categories/categories.routes').then(
            (m) => m.CategoriesRoutes
          ),
      },
      {
        path: 'communes',
        canActivateChild: [AuthenticatedGuard],
        loadChildren: () =>
          import('./pages/communes/communes.routes').then((m) => m.CommunesRoutes),
      },
      {
        path: 'map',
        canActivateChild: [AuthenticatedGuard],
        loadChildren: () => import('./pages/map/map.routes').then((m) => m.MapRoutes),
      },
      {
        path: 'reports',
        canActivateChild: [AuthenticatedGuard],
        loadChildren: () =>
          import('./pages/reports/reports.routes').then((m) => m.ReportsRoutes),
      },
    ],
  },
  {
    path: '',
    component: BlankComponent,
    canActivateChild: [NoAuthenticatedGuard],
    children: [
      {
        path: 'authentication',
        loadChildren: () =>
          import('./pages/authentication/authentication.routes').then(
            (m) => m.AuthenticationRoutes
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'authentication/error',
  },
];
