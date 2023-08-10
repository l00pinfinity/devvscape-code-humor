import { TestBed } from '@angular/core/testing';

import { AdMobService } from './ad-mob.service';

describe('AdMobService', () => {
  let service: AdMobService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdMobService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
