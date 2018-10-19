import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorLoginComponent } from './tutor-login.component';

describe('TutorLoginComponent', () => {
  let component: TutorLoginComponent;
  let fixture: ComponentFixture<TutorLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
