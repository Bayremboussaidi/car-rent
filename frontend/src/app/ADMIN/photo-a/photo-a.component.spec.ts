import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoAComponent } from './photo-a.component';

describe('PhotoAComponent', () => {
  let component: PhotoAComponent;
  let fixture: ComponentFixture<PhotoAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PhotoAComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhotoAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
