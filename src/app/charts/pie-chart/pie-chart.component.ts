import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ChartData } from 'src/app/core/models/ChartData';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.scss'
})
export class PieChartComponent {

  constructor(private router: Router){}

  @Input() chartData! : ChartData[];

  onSelect(event : ChartData) {
    this.router.navigate(['/details', event.name])
  }

}
