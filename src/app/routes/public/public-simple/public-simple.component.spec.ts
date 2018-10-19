import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicSimpleComponent } from './public-simple.component';

describe('PublicSimpleComponent', () => {
  let component: PublicSimpleComponent;
  let fixture: ComponentFixture<PublicSimpleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicSimpleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicSimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
