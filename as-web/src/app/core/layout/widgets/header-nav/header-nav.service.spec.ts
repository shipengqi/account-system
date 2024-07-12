import { TestBed } from '@angular/core/testing';

import { HeaderNavService } from './header-nav.service';

describe('HeaderNavService', () => {
  let service: HeaderNavService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeaderNavService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
