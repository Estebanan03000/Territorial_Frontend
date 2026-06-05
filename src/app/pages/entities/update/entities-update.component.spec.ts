import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntitiesUpdateComponent } from './entities-update.component';

describe('EntitiesUpdateComponent', () => {
  let component: EntitiesUpdateComponent;
  let fixture: ComponentFixture<EntitiesUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntitiesUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntitiesUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
