import { TestBed } from '@angular/core/testing';

import { CurrentAdminService } from './current-admin.service';

describe('CurrentAdminService', () => {
  let service: CurrentAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrentAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
