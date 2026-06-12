import { TestBed } from '@angular/core/testing';

import { AnnotationImageService } from './annotation-image.service';

describe('AnnotationImageService', () => {
  let service: AnnotationImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnnotationImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
