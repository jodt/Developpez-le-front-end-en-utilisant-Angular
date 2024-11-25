import { Component, Input } from '@angular/core';
import { LineChartData } from 'src/app/core/models/LineChartData';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.scss'
})
export class LineChartComponent {

  @Input() lineChartData!: LineChartData[];
  @Input() xAxisLabel!: string;
  @Input() yAxisLabel!: string;
  
}
