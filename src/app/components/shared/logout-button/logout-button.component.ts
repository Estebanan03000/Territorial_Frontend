import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ConfirmActionButtonComponent } from '../confirm-action-button/confirm-action-button.component';
import { SessionControlService } from '../../../services/session-control.service';

@Component({
  selector: 'app-logout-button',
  standalone: true,
  imports: [CommonModule, ConfirmActionButtonComponent],
  templateUrl: './logout-button.component.html',
  styleUrl: './logout-button.component.scss',
})
export class LogoutButtonComponent {
  @Input() label: string = 'Cerrar sesión';
  @Input() fullWidth: boolean = false;
  @Input() color: string = 'warn';

  @Output() logoutDone = new EventEmitter<void>();

  constructor(private sessionControlService: SessionControlService) {}

  logout(): void {
    this.sessionControlService.closeSession();
    this.logoutDone.emit();
  }
}
