import { Component, OnInit } from '@angular/core';
import { Observable, of, take } from 'rxjs';
import { MedalPerCounrty } from 'src/app/core/models/MedalPerCountry';
import { OlympicCountry } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  //public olympics$: Observable<OlympicCountry[] | undefined> = of(undefined);
  public medalPerCountry$!: Observable<MedalPerCounrty[]>;
  public numberOfJos$!: Observable<number>;
  public numberOfCountry$!: Observable<number>;
  public error$!: Observable<string | null>;


  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    //this.olympics$ = this.olympicService.getOlympics();
    this.medalPerCountry$ = this.olympicService.getMedalPerCountry();
    this.numberOfCountry$ = this.olympicService.getTotalCountries();
    this.numberOfJos$ = this.olympicService.getNumberOfJos();
    this.error$ = this.olympicService.getError();
  }
  
}
