import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Subscription } from 'rxjs';

import { User } from '../../../models/user';
import { SecurityService } from '../../../services/security.service';
import { LogoutButtonComponent } from '../logout-button/logout-button.component';

@Component({
  selector: 'app-user-session-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, LogoutButtonComponent],
  templateUrl: './user-session-card.component.html',
  styleUrl: './user-session-card.component.scss',
})
export class UserSessionCardComponent implements OnInit, OnDestroy {
  user: User | null = null;
  private userSubscription?: Subscription;

  constructor(private securityService: SecurityService) {}

  ngOnInit(): void {
    this.userSubscription = this.securityService
      .getCurrentUser()
      .subscribe((user) => {
        this.user = user;
      });
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }
}
