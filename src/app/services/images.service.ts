import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {
  private readonly apiUrl = `${environment.apiUrl}/api/images`;

  getImageUrl(relativePath: string): string {
    return `${this.apiUrl}/${relativePath}`;
  }
}
