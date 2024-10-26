import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, Subject, of } from 'rxjs';
import { catchError, filter, map, tap } from 'rxjs/operators';
import { OlympicCountry } from '../models/Olympic';
import { MedalPerCounrty } from '../models/MedalPerCountry';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<OlympicCountry[]>([]);
  private error$ = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {}

  loadInitialData() {
    return this.http.get<OlympicCountry[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error) => {
        // TODO: improve error handling
        console.error(error);
        this.error$.next("Il semble y avoir une erreur lors de la récupération des données")
        // can be useful to end loading state and let the user know something went wrong
        this.olympics$.next([]);
        return of([]);
      })
    );
  }

  getOlympics() {
    return this.olympics$.asObservable();
  }

  getMedalPerCountry() : Observable<MedalPerCounrty[]> {
    return this.getOlympics().pipe(
      map(olympicCountries => olympicCountries?.map(country => ({
        name: country.country,
        value: country.participations.reduce((total, participation) => total + participation.medalsCount, 0)
      })) || [])
    )
  }

  getTotalCountries() : Observable<number> {
    return this.getOlympics().pipe(
      map(olympicCountries => olympicCountries?.length || 0)
    )
  }

  getNumberOfJos() : Observable<number> {
    return this.getOlympics().pipe(
      map(olympicCountries => {
        if (olympicCountries?.length > 0) {
          return olympicCountries[0].participations.length
        } else {
          return 0;
        }
      })
    )
  }

  getError() : Observable<string | null> {
    return this.error$.asObservable();
  }

}
