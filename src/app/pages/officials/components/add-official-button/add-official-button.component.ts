import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-official-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './add-official-button.component.html',
  styleUrl: './add-official-button.component.scss',
})
export class AddOfficialButtonComponent {
  @Input() entityId?: number;

  constructor(private router: Router) {}

  goToCreate(): void {
    if (this.entityId) {
      this.router.navigate(['/officials/create'], {
        queryParams: { entityId: this.entityId },
      });
      return;
    }

    this.router.navigate(['/officials/create']);
  }
}
