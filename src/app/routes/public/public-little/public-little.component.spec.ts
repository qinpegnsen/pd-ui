import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicLittleComponent } from './public-little.component';

describe('PublicLittleComponent', () => {
  let component: PublicLittleComponent;
  let fixture: ComponentFixture<PublicLittleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicLittleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicLittleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
