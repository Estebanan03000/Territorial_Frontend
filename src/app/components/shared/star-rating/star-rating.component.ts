import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './star-rating.component.html',
  styleUrl: './star-rating.component.scss',
})
export class StarRatingComponent {
  @Input() rating: number = 0;
  @Input() readonly: boolean = true;
  @Input() showNumber: boolean = false;

  @Output() ratingChange = new EventEmitter<number>();

  stars = [1, 2, 3, 4, 5];
  hoverRating = 0;

  get displayRating(): number {
    return this.hoverRating || this.rating || 0;
  }

  setRating(value: number): void {
    if (this.readonly) {
      return;
    }

    this.rating = value;
    this.ratingChange.emit(value);
  }

  setHover(value: number): void {
    if (!this.readonly) {
      this.hoverRating = value;
    }
  }

  clearHover(): void {
    this.hoverRating = 0;
  }

  isActive(value: number): boolean {
    return value <= Math.round(this.displayRating);
  }
}
