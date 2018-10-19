import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorCenterComponent } from './tutor-center.component';

describe('TutorCenterComponent', () => {
  let component: TutorCenterComponent;
  let fixture: ComponentFixture<TutorCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
