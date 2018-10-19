import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LookCommentComponent } from './look-comment.component';

describe('LookCommentComponent', () => {
  let component: LookCommentComponent;
  let fixture: ComponentFixture<LookCommentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LookCommentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LookCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
