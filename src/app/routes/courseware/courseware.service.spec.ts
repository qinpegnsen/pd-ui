import { TestBed, inject } from '@angular/core/testing';

import { CoursewareService } from './courseware.service';

describe('CoursewareService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoursewareService]
    });
  });

  it('should be created', inject([CoursewareService], (service: CoursewareService) => {
    expect(service).toBeTruthy();
  }));
});
