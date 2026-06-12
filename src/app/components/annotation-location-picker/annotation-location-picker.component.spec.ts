import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnotationLocationPickerComponent } from './annotation-location-picker.component';

describe('AnnotationLocationPickerComponent', () => {
  let component: AnnotationLocationPickerComponent;
  let fixture: ComponentFixture<AnnotationLocationPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnotationLocationPickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnotationLocationPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
