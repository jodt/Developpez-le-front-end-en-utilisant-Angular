import { Component, Input } from '@angular/core';
import { MedalPerCounrty } from 'src/app/core/models/MedalPerCountry';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.scss'
})
export class PieChartComponent {

  @Input() chartData! : MedalPerCounrty[];

}
