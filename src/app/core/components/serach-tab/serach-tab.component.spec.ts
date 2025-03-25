import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SerachTabComponent } from './serach-tab.component';

describe('SerachTabComponent', () => {
  let component: SerachTabComponent;
  let fixture: ComponentFixture<SerachTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SerachTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SerachTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
