import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorTimetableComponent } from './tutor-timetable.component';

describe('TutorTimetableComponent', () => {
  let component: TutorTimetableComponent;
  let fixture: ComponentFixture<TutorTimetableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorTimetableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorTimetableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
