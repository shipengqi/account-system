import { TestBed } from '@angular/core/testing';

import { ACLService } from './acl.service';

describe('ACLService', () => {
  let service: ACLService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ACLService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
