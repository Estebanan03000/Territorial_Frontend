import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { AnnotationMapViewMode } from 'src/app/models/annotation-map-item';

@Component({
  selector: 'app-annotation-map-summary',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './annotation-map-summary.component.html',
  styleUrl: './annotation-map-summary.component.scss',
})
export class AnnotationMapSummaryComponent {
  @Input() totalAnnotations: number = 0;
  @Input() visibleAnnotations: number = 0;
  @Input() selectedCategories: number = 0;
  @Input() viewMode: AnnotationMapViewMode = 'markers';
}
