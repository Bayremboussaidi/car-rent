import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewsAComponent } from './reviews-a.component';

describe('ReviewsAComponent', () => {
  let component: ReviewsAComponent;
  let fixture: ComponentFixture<ReviewsAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReviewsAComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewsAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
