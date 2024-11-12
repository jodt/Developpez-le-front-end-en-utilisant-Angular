import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, take, tap } from 'rxjs';
import { LineChartData } from 'src/app/core/models/LineChartData';
import { OlympicCountry } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit{

  public countryName: string ="";
  public olympicCountry$!: Observable<OlympicCountry | undefined>;
  public totalmedals$!: Observable<number>
  public totalAthletes$!: Observable<number>
  public totalEntries$!: Observable<number>
  public medalsByParticipation$!: Observable<LineChartData[]>
  public error$!: Observable<string | null>;
  public isLoading$! : Observable<boolean>;

  constructor(private route : ActivatedRoute, private olympicService : OlympicService){}

  ngOnInit(): void {
    this.getCounrtyNameFromRoute();
    this.initData();
  }

  private getCounrtyNameFromRoute(){
    this.route.params
    .pipe(
      take(1)
    )
    .subscribe(params => this.countryName = params['countryName'])
  }

  private initData(){
    this.totalmedals$ = this.olympicService.getMedals(this.countryName);
    this.totalAthletes$ = this.olympicService.getAthletes(this.countryName);
    this.totalEntries$ = this.olympicService.getParticipations(this.countryName).pipe(map(participations => participations.length));
    this.medalsByParticipation$ = this.olympicService.getmedalsByParticipation(this.countryName);
    this.error$ = this.olympicService.getError();
    this.isLoading$ = this.olympicService.getLoadindStatus();
  }
}
