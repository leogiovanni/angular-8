import { TestBed } from '@angular/core/testing';

import { RollbarService } from './rollbar.service';

describe('RollbarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RollbarService = TestBed.get(RollbarService);
    expect(service).toBeTruthy();
  });
});
