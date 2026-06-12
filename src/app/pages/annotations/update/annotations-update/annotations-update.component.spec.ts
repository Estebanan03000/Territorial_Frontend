import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnotationsUpdateComponent } from './annotations-update.component';

describe('AnnotationsUpdateComponent', () => {
  let component: AnnotationsUpdateComponent;
  let fixture: ComponentFixture<AnnotationsUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnotationsUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnotationsUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
