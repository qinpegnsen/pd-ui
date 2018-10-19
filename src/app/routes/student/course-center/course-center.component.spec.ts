import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseCenterComponent } from './course-center.component';

describe('CourseCenterComponent', () => {
  let component: CourseCenterComponent;
  let fixture: ComponentFixture<CourseCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
