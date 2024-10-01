import { TestBed } from '@angular/core/testing';

import { ProductsSignalService } from './products-signal.service';

describe('ProductsSignalService', () => {
  let service: ProductsSignalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductsSignalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
