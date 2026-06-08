import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { environment } from 'src/environments/environments';
import { Evidence } from 'src/app/models/evidence';

@Component({
  selector: 'app-image-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-gallery.component.html',
  styleUrl: './image-gallery.component.scss',
})
export class ImageGalleryComponent {
  @Input() evidences: Evidence[] = [];
  @Input() maxVisible: number = 3;

  get visibleEvidences(): Evidence[] {
    return this.evidences.slice(0, this.maxVisible);
  }

  get extraCount(): number {
    const extra = this.evidences.length - this.maxVisible;
    return extra > 0 ? extra : 0;
  }

  getFileUrl(evidence: Evidence): string {
    const fileUrl = evidence.file_url || '';

    if (fileUrl.startsWith('http')) {
      return fileUrl;
    }

    if (fileUrl.startsWith('/')) {
      return `${environment.apiUrl}${fileUrl}`;
    }

    return `${environment.apiUrl}/${fileUrl}`;
  }
}
