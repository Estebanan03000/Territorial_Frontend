import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { SecurityService } from '../services/security.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticatedGuard implements CanActivateChild {

  constructor(
    private securityService: SecurityService,
    private router: Router
  ) {}

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log('🔒 Verificando autenticación para ruta:', state.url);

    const googleToken = localStorage.getItem('google_token');
    const githubToken = localStorage.getItem('github_token');

    if (googleToken || githubToken) {
      return of(true);
    }

    return this.securityService.getCurrentUser().pipe(
      take(1),
      map((user) => {
        if (user) {
          return true;
        }

        this.router.navigate(['/authentication/login']);
        return false;
      }),
      catchError(() => {
        this.router.navigate(['/authentication/login']);
        this.securityService.clearUser();
        return of(false);
      })
    );
  }
}
