import { TestBed } from '@angular/core/testing';

import { DataResolverService } from './data-resolver.service';

describe('DataResolverService', () => {
  let service: DataResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
