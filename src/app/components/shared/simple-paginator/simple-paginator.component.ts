import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-simple-paginator',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './simple-paginator.component.html',
  styleUrl: './simple-paginator.component.scss',
})
export class SimplePaginatorComponent {
  @Input() page: number = 1;
  @Input() totalPages: number = 0;
  @Input() totalItems: number = 0;
  @Input() itemLabel: string = 'registros';

  @Output() previousPage = new EventEmitter<void>();
  @Output() nextPage = new EventEmitter<void>();

  get hasPrevious(): boolean {
    return this.page > 1;
  }

  get hasNext(): boolean {
    return this.page < this.totalPages;
  }

  onPrevious(): void {
    if (this.hasPrevious) {
      this.previousPage.emit();
    }
  }

  onNext(): void {
    if (this.hasNext) {
      this.nextPage.emit();
    }
  }
}