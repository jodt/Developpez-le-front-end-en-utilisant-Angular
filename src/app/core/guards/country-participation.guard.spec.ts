import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { countryParticipationGuard } from './country-participation.guard';

describe('countryParticipationGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => countryParticipationGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
