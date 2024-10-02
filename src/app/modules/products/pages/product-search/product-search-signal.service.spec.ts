import { TestBed } from '@angular/core/testing';

import { ProductSearchSignalService } from './product-search-signal.service';

describe('ProductSearchSignalService', () => {
  let service: ProductSearchSignalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductSearchSignalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
