import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { SecurityService } from './security.service';

@Injectable({
  providedIn: 'root',
})
export class SessionControlService {
  private readonly loginRoute = '/authentication/login';

  constructor(
    private securityService: SecurityService,
    private router: Router
  ) {}

  closeSession(): void {
    this.securityService.logout().subscribe({
      next: () => {
        this.goToLogin();
      },
      error: () => {
        this.securityService.clearUser();
        this.goToLogin();
      },
    });
  }

  closeLocalSession(): void {
    this.securityService.clearUser();
    this.goToLogin();
  }

  private goToLogin(): void {
    this.router.navigate([this.loginRoute]);
  }
}
