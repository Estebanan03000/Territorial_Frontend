import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { TrackingSummary } from 'src/app/models/tracking-summary';

@Component({
  selector: 'app-tracking-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tracking-summary.component.html',
  styleUrl: './tracking-summary.component.scss',
})
export class TrackingSummaryComponent {
  @Input() summary: TrackingSummary = {
    online: 0,
    offline: 0,
    lastKnown: 0,
    total: 0,
  };
}
