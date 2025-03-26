import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookLoaderComponent } from './book-loader.component';

describe('BookLoaderComponent', () => {
  let component: BookLoaderComponent;
  let fixture: ComponentFixture<BookLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookLoaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
