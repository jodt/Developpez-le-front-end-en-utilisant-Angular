import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, delay, map, tap } from 'rxjs/operators';
import { OlympicCountry } from '../models/Olympic';
import { ChartData } from '../models/ChartData';
import { Participation } from '../models/Participation';
import { LineChartData } from '../models/LineChartData';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<OlympicCountry[]>([]);
  private error$ = new BehaviorSubject<string | null>(null);
  private isLoading$ = new BehaviorSubject<boolean>(true);

  constructor(private http: HttpClient) {}

  loadInitialData() {
    return this.http.get<OlympicCountry[]>(this.olympicUrl).pipe(
      delay(2000),
      tap((value) => 
        {this.olympics$.next(value);
          this.isLoading$.next(false);
        }),
      catchError((error) => {
        this.error$.next("Il semble y avoir une erreur lors de la récupération des données")
        this.olympics$.next([]);
        this.isLoading$.next(false);
        return of([]);
      })
    );
  }

  getOlympics() {
    return this.olympics$.asObservable();
  }
  
  getMedalPerCountry() : Observable<ChartData[]> {
    return this.getOlympics().pipe(
      map(olympicCountries => olympicCountries.map(country => ({
        name: country.country,
        value: country.participations.reduce((total, participation) => total + participation.medalsCount, 0)
      })))
    )
  }

  getTotalCountries() : Observable<number> {
    return this.getOlympics().pipe(
      map(olympicCountries => olympicCountries.length)
    )
  }

  //todo revoir cette methode pour calculer le nombre de jo
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
    let participations$: Observable<Participation[]> = this.getParticipations(name);
    return participations$.pipe(map(
      participation => participation?.reduce((total,participation) => total + participation.medalsCount,0)
    ))
  }

  getAthletes(name:string) : Observable<number> {
    let participations$: Observable<Participation[]> = this.getParticipations(name);
    return participations$.pipe(map(
      participation => participation?.reduce((total,participation) => total + participation.athleteCount,0)
    ))
  }

  getmedalsByParticipation(name: string): Observable<LineChartData[]> {
    let participations$: Observable<Participation[]> = this.getParticipations(name);
    return participations$.pipe(
      map(participations => {
        let medalsByParticipation: LineChartData = {
          name:name,
          series: participations.map(participation => ({
            name:participation.year.toString(),
            value: participation.medalsCount
          }))
        };
        return Array(medalsByParticipation)
      })
    )
  }

  getError() : Observable<string | null> {
    return this.error$.asObservable();
  }

  getLoadindStatus() : Observable<boolean> {
    return this.isLoading$.asObservable();
  }
}
