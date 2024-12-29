import { TestBed } from '@angular/core/testing';

import { ACLGuardService } from './acl-guard.service';

describe('ACLGuardService', () => {
  let service: ACLGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ACLGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
