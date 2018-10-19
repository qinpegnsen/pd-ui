import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterTotalComponent } from './register-total.component';

describe('RegisterTotalComponent', () => {
  let component: RegisterTotalComponent;
  let fixture: ComponentFixture<RegisterTotalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterTotalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterTotalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
