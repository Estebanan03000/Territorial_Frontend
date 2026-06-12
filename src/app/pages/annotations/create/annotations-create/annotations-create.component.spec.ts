import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnotationsCreateComponent } from './annotations-create.component';

describe('AnnotationsCreateComponent', () => {
  let component: AnnotationsCreateComponent;
  let fixture: ComponentFixture<AnnotationsCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnotationsCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnotationsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
