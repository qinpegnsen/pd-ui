import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorDetailsComponent } from './tutor-details.component';

describe('TutorDetailsComponent', () => {
  let component: TutorDetailsComponent;
  let fixture: ComponentFixture<TutorDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
