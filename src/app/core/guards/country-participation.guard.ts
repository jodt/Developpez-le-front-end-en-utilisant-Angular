import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { OlympicService } from '../services/olympic.service';
import { map, of, take, tap } from 'rxjs';
import { OlympicCountry } from '../models/Olympic';

export const countryParticipationGuard: CanActivateFn = (route) => {
  const olympicService: OlympicService = inject(OlympicService);
  const router: Router = inject(Router);
  const country = route.paramMap.get('countryName');

  if (!country) {
    router.navigate(['/not-found']);
    return of(false);
  }

  return olympicService.getOlympicCountryByName(country).pipe(
    take(1),
    map((response: OlympicCountry | undefined) => {
      if (!response) {
        router.navigate(['/not-found']);
        return false;
      } else {
        return true;
      }
    })
  );
};
