import { TestBed } from '@angular/core/testing';

import { HackersNewsService } from './hackers-news.service';

describe('HackersNewsService', () => {
  let service: HackersNewsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HackersNewsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
