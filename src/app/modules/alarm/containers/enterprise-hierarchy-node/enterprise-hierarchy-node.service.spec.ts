import { TestBed } from '@angular/core/testing';

import { EnterpriseHierarchyNodeService } from './enterprise-hierarchy-node.service';

describe('EnterpriseHierarchyNodeService', () => {
  let service: EnterpriseHierarchyNodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnterpriseHierarchyNodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
