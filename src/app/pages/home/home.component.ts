import { Component, OnInit } from '@angular/core';
import { Observable, of, take } from 'rxjs';
import { ChartData } from 'src/app/core/models/ChartData';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public medalPerCountry$!: Observable<ChartData[]>;
  public numberOfJos$!: Observable<number>;
  public numberOfCountry$!: Observable<number>;
  public error$!: Observable<string | null>;
  public isLoading$!: Observable<boolean>;


  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.medalPerCountry$ = this.olympicService.getMedalPerCountry();
    this.numberOfCountry$ = this.olympicService.getTotalCountries();
    this.numberOfJos$ = this.olympicService.getNumberOfJos();
    this.error$ = this.olympicService.getError();
    this.isLoading$ = this.olympicService.getLoadindStatus();
  }
  
}
