import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { delay, map, Observable, Subject, take, takeUntil, tap } from 'rxjs';
import { LineChartData } from 'src/app/core/models/LineChartData';
import { OlympicCountry } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export class DetailsComponent implements OnInit, OnDestroy {
  public countryName: string = '';
  public olympicCountry$!: Observable<OlympicCountry | undefined>;
  public totalmedals$!: Observable<number>;
  public totalAthletes$!: Observable<number>;
  public totalEntries$!: Observable<number>;
  public medalsByParticipation$!: Observable<LineChartData[]>;
  public isLoading: boolean = true;
  private destroy$ = new Subject<boolean>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private olympicService: OlympicService
  ) {}
  
  ngOnInit(): void {
    this.getCountryNameFromRoute();
    this.initDataOrRedirect();
  }

  private getCountryNameFromRoute() {
    this.countryName = this.route.snapshot.params['countryName'];
  }

  private initDataOrRedirect() {
    this.olympicService.getLoadindStatus()
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (isloading) => {
        if (!isloading) {
          this.isLoading = false;
          this.initDataIfParticipated();
        }
      }
    )
  }

  private initDataIfParticipated() {
    this.olympicService.getOlympicCountryByName(this.countryName)
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (response) => {
        if (response) {
          this.initData()
        } else (
          this.router.navigate(["/not-found"])
        )
      }
    )
  }
  

  private initData() {
    this.totalmedals$ = this.olympicService.getMedals(this.countryName);
    this.totalAthletes$ = this.olympicService.getAthletes(this.countryName);
    this.totalEntries$ = this.olympicService.getParticipations(this.countryName).pipe(map((participations) => participations.length));
    this.medalsByParticipation$ = this.olympicService.getmedalsByParticipation(this.countryName);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
