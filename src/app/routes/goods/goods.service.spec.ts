import { TestBed, inject } from '@angular/core/testing';

import { GoodsService } from './goods.service';

describe('GoodsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GoodsService]
    });
  });

  it('should be created', inject([GoodsService], (service: GoodsService) => {
    expect(service).toBeTruthy();
  }));
});
