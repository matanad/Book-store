import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrashBtnComponent } from './trash-btn.component';

describe('TrashBtnComponent', () => {
  let component: TrashBtnComponent;
  let fixture: ComponentFixture<TrashBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrashBtnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrashBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
