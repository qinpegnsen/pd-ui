import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayCancelComponent } from './pay-cancel.component';

describe('PayCancelComponent', () => {
  let component: PayCancelComponent;
  let fixture: ComponentFixture<PayCancelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayCancelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
