import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorInitComponent } from './tutor-init.component';

describe('TutorInitComponent', () => {
  let component: TutorInitComponent;
  let fixture: ComponentFixture<TutorInitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorInitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorInitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
