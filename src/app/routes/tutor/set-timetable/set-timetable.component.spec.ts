import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetTimetableComponent } from './set-timetable.component';

describe('SetTimetableComponent', () => {
  let component: SetTimetableComponent;
  let fixture: ComponentFixture<SetTimetableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetTimetableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetTimetableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
