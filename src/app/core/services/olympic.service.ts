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

  /**
   * Load initial data
   * @returns {Observable<OlympicCountry[]>} 
   *          An observable emitting an array with country data on success
   *          or an empty array on error
   */
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


  /**
   * Returns an observable of Olympic data.
   * @returns {Observable<OlympicCountry[]>}
   */
  getOlympics() {
    return this.olympics$.asObservable();
  }
  

  /**
   * Returns the number of medals per country.
   * This method transforms the list of Olympic countries into a chart-compatible data format.
   * 
   * @returns {Observable<ChartData[]>} 
   *           An observable emitting an object array
   *           where each object contains the name of the country and 
   *           the number of medals or a empty array if there are no Olympic 
   *           data.
   */
  getMedalPerCountry() : Observable<ChartData[]> {
    return this.getOlympics().pipe(
      map(olympicCountries => olympicCountries.map(country => ({
        name: country.country,
        value: country.participations.reduce((total, participation) => total + participation.medalsCount, 0)
      })))
    )
  }


  /**
   * Calculates the number of countries.
   * 
   * @returns {Observable<number>}
   *          An observable emitting the number of countries.
   */
  getTotalCountries() : Observable<number> {
    return this.getOlympics().pipe(
      map(olympicCountries => olympicCountries.length)
    )
  }


  /**
   * Calculates the total number of distinct Olympic Games.
   * 
   * @returns {Observable<number>}
   *          An observable emitting the number of distinct Olympic Games.
   */
  getNumberOfJos() : Observable<number> {
    return this.getOlympics().pipe(
      map(olympicCountries => {
        let yearsOfJos = new Set();
        for (let olympicCountry of olympicCountries) {
          for (let participation of olympicCountry.participations){
            yearsOfJos.add(participation.year)
          }
        }
        return yearsOfJos.size;
      })
    )
  }


  /**
   * Returns data for a country and its participations in the Olympic Games.
   * 
   * @param {string} name 
   *        The name of the country.
   * 
   * @returns {Observable<OlympicCountry | undefined>}
   *          An observable emitting data on a country and its
   *          participation in the Olympic Games or undefined if
   *          the country is not part of the data.
   *          
   */
  getOlympicCountryByName(name : string) : Observable<OlympicCountry | undefined> {
    return this.getOlympics().pipe(
      map(olympicCountries => 
        olympicCountries.find((olympicCountry) => olympicCountry.country === name)
      )
    )
  }


/**
 * Returns a country's participations in the Olympic Games.
 * 
 * @param {string} name 
 *        The name of the country.
 * 
 * @returns {Observable<Participation[]>}
 *          An observable emitting an array of all 
 *          the participations of a country in the Olympic games.
 */
  getParticipations(name: string): Observable<Participation[]>{
    return this.getOlympicCountryByName(name).pipe(
      map( country => country?.participations ?? [])
    )
  }

  /**
   * Calculates the total number of medals won by a country.
   * 
   * @param {string} name
   *        The name of the country.
   * 
   * @returns {Observable<number>}
   *          An observable emitting the total number of medals won by a country.
   */
  getMedals(name:string) : Observable<number> {
    let participations$: Observable<Participation[]> = this.getParticipations(name);
    return participations$.pipe(map(
      participation => participation?.reduce((total,participation) => total + participation.medalsCount,0)
    ))
  }

  /**
   * Calculates the total number of athletes who participated in the Olympic Games for a given country
   * 
   * @param {string} name
   *        The name of the country.
   *  
   * @returns {Observable<number>}
   *          An observable emitting the total number of athletes for the country.
   */
  getAthletes(name:string) : Observable<number> {
    let participations$: Observable<Participation[]> = this.getParticipations(name);
    return participations$.pipe(map(
      participation => participation?.reduce((total,participation) => total + participation.athleteCount,0)
    ))
  }

  /**
   * Returns the number of medals won per Olympic participation for a given country.
   * 
   * This method transforms the country's participation list into a chart-compatible data format.
   * 
   * @param {string} name
   *        The name of the country.
   *  
   * @returns {Observable<LineChartData[]>}
   *          An observable emitting an array of object where each object contains 
   *          the name field whose value is the name of the country and the series fields which are an array of objects 
   *          where each object contains the year and the number of medals won this year     
   */
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

  /**
   * Returns the error message if an error occurs, or "null" if no error.
   * @returns {Observable<string | null>}
   *          An observable emitting a string (the error message) or null;
   */
  getError() : Observable<string | null> {
    return this.error$.asObservable();
  }


  /**
   * Return data loading status
   * 
   * @returns {Observable<boolean>}
   *          An observable emitting "true" when data is still loading,
   *          and "false" once the data has been loaded.
   */
  getLoadindStatus() : Observable<boolean> {
    return this.isLoading$.asObservable();
  }
}
