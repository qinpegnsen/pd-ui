import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeachingRecordComponent } from './teaching-record.component';

describe('TeachingRecordComponent', () => {
  let component: TeachingRecordComponent;
  let fixture: ComponentFixture<TeachingRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeachingRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeachingRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
