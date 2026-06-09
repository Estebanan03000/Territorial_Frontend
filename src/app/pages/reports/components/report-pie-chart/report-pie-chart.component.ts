import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import {
  ApexChart,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexLegend,
  NgApexchartsModule
} from 'ng-apexcharts';

import { ReportResponse } from 'src/app/models/report';

type PieChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  responsive: ApexResponsive[];
  legend: ApexLegend;
};

@Component({
  selector: 'app-report-pie-chart',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './report-pie-chart.component.html',
  styleUrl: './report-pie-chart.component.scss'
})
export class ReportPieChartComponent implements OnChanges {

  @Input() report?: ReportResponse;

  chartOptions?: Partial<PieChartOptions>;

  ngOnChanges(): void {
    if (!this.report) return;

    const series = Array.isArray(this.report.series) && typeof this.report.series[0] === 'number'
      ? this.report.series as number[]
      : [];

    this.chartOptions = {
      series,
      chart: {
        type: 'pie',
        height: 380
      },
      labels: this.report.labels || [],
      legend: {
        position: 'bottom'
      },
      responsive: [
        {
          breakpoint: 640,
          options: {
            chart: {
              height: 300
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      ]
    };
  }
}