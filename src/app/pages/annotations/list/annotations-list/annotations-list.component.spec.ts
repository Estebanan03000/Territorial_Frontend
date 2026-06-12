import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnotationsListComponent } from './annotations-list.component';

describe('AnnotationsListComponent', () => {
  let component: AnnotationsListComponent;
  let fixture: ComponentFixture<AnnotationsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnotationsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnotationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
