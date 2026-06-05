import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-confirm-action-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './confirm-action-button.component.html',
  styleUrl: './confirm-action-button.component.scss',
})
export class ConfirmActionButtonComponent {
  @Input() label: string = 'Confirmar';
  @Input() title: string = 'Confirmar acción';
  @Input() text: string = '¿Desea continuar?';
  @Input() confirmButtonText: string = 'Aceptar';
  @Input() cancelButtonText: string = 'Cancelar';
  @Input() icon: any = 'question';
  @Input() color: string = 'primary';
  @Input() fullWidth: boolean = false;
  @Input() disabled: boolean = false;

  @Output() confirmed = new EventEmitter<void>();

  confirm(): void {
    Swal.fire({
      title: this.title,
      text: this.text,
      icon: this.icon,
      showCancelButton: true,
      confirmButtonText: this.confirmButtonText,
      cancelButtonText: this.cancelButtonText,
    }).then((result) => {
      if (result.isConfirmed) {
        this.confirmed.emit();
      }
    });
  }
}
