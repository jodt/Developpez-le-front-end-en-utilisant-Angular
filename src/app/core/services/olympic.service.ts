import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, Subject, of, partition } from 'rxjs';
import { catchError, filter, map, tap } from 'rxjs/operators';
import { OlympicCountry } from '../models/Olympic';
import { ChartData } from '../models/ChartData';
import { Participation } from '../models/Participation';

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

  getMedalPerCountry() : Observable<ChartData[]> {
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

  getOlympicCountryByName(name : string) : Observable<OlympicCountry | undefined> {
    return this.getOlympics().pipe(
      map(olympicCountries => 
        olympicCountries.find((olympicCountry) => olympicCountry.country === name)
      )
    )
  }

  getParticipations(name: string): Observable<Participation[]>{
    return this.getOlympicCountryByName(name).pipe(
      map( country => country?.participations ?? [])
    )
  }

  getMedals(name:string) : Observable<number> {
    let participations: Observable<Participation[]> = this.getParticipations(name);
    return participations.pipe(map(
      participation => participation?.reduce((total,participation) => total + participation.medalsCount,0) || 0
    ))
  }

  getAthletes(name:string) : Observable<number> {
    let participations: Observable<Participation[]> = this.getParticipations(name);
    return participations.pipe(map(
      participation => participation?.reduce((total,participation) => total + participation.athleteCount,0) || 0
    ))
  }
}
