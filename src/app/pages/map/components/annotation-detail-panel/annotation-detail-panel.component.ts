import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';

import { AnnotationMapItem } from 'src/app/models/annotation-map-item';
import { StarRatingComponent } from 'src/app/components/shared/star-rating/star-rating.component';
import { ImageGalleryComponent } from 'src/app/components/shared/image-gallery/image-gallery.component';

@Component({
  selector: 'app-annotation-detail-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatCardModule, MatInputModule, StarRatingComponent, ImageGalleryComponent],
  templateUrl: './annotation-detail-panel.component.html',
  styleUrl: './annotation-detail-panel.component.scss',
})
export class AnnotationDetailPanelComponent implements OnChanges {
  @Input() item?: AnnotationMapItem;

  @Output() closePanel = new EventEmitter<void>();
  @Output() locate = new EventEmitter<AnnotationMapItem>();
  @Output() saveVote = new EventEmitter<{ item: AnnotationMapItem; stars: number; comment: string }>();

  stars = 0;
  comment = '';

  ngOnChanges(): void {
    this.stars = 0;
    this.comment = '';
  }

  get categoryName(): string {
    return this.item?.mainCategory?.name || 'Sin categoría';
  }

  get subcategoryName(): string {
    return this.item?.subcategory?.name || 'Sin subcategoría';
  }

  get dateText(): string {
    const date = this.item?.annotation.registration_date;
    return date ? new Date(date).toLocaleString() : 'Sin fecha';
  }

  get placeText(): string {
    return this.item?.neighborhood?.name || 'Sin barrio';
  }

  get citizenName(): string {
    return this.item?.citizen?.name || 'Ciudadano no identificado';
  }

  getRatingCount(star: number): number {
    return this.item?.votes.filter((vote) => Number(vote.stars) === star).length || 0;
  }

  getRatingPercent(star: number): number {
    if (!this.item || this.item.votes.length === 0) {
      return 0;
    }

    return (this.getRatingCount(star) / this.item.votes.length) * 100;
  }

  onLocate(): void {
    if (this.item) {
      this.locate.emit(this.item);
    }
  }

  onSaveVote(): void {
    if (!this.item || this.stars < 1) {
      return;
    }

    this.saveVote.emit({ item: this.item, stars: this.stars, comment: this.comment });
  }
}
