import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  Router,
  RouterStateSnapshot
} from '@angular/router';

import { of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { SecurityService } from '../services/security.service';

@Injectable({
  providedIn: 'root'
})
export class NoAuthenticatedGuard implements CanActivateChild {

  constructor(
    private securityService: SecurityService,
    private router: Router
  ) {}

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {

    console.log(
      '🔓 Verificando NO autenticación para ruta:',
      state.url
    );

    const googleToken =
      localStorage.getItem('google_token');

    const githubToken =
      localStorage.getItem('github_token');

    if (googleToken || githubToken) {
      return of(
        this.router.createUrlTree(['/dashboard'])
      );
    }

    return this.securityService
      .getCurrentUser()
      .pipe(
        take(1),
        map((user) => {

          if (user) {
            return this.router.createUrlTree(
              ['/dashboard']
            );
          }

          return true;
        })
      );
  }
}
