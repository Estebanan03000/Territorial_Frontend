import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnnotationImageService {

  private getKey(id: number): string {
    return `annotation-image-${id}`;
  }

  saveImage(
    annotationId: number,
    imageBase64: string
  ): void {

    localStorage.setItem(
      this.getKey(annotationId),
      imageBase64
    );

  }

  getImage(
    annotationId: number
  ): string | null {

    return localStorage.getItem(
      this.getKey(annotationId)
    );

  }

  removeImage(
    annotationId: number
  ): void {

    localStorage.removeItem(
      this.getKey(annotationId)
    );

  }

}
