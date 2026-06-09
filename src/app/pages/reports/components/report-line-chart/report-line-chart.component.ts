import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexDataLabels,
  ApexStroke,
  ApexMarkers,
  ApexGrid,
  ApexTooltip,
  NgApexchartsModule
} from 'ng-apexcharts';

import { ReportResponse, ReportSeriesItem } from 'src/app/models/report';

type LineChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  markers: ApexMarkers;
  grid: ApexGrid;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-report-line-chart',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './report-line-chart.component.html',
  styleUrl: './report-line-chart.component.scss'
})
export class ReportLineChartComponent implements OnChanges {

  @Input() report?: ReportResponse;

  chartOptions?: Partial<LineChartOptions>;

  ngOnChanges(): void {
    if (!this.report) return;

    const series = this.normalizeSeries(this.report);
    const categories = this.report.labels || this.buildDefaultCategories(series);

    this.chartOptions = {
      series,
      chart: {
        type: 'line',
        height: 380,
        toolbar: {
          show: true
        }
      },
      dataLabels: {
        enabled: true
      },
      stroke: {
        curve: 'smooth',
        width: 3
      },
      markers: {
        size: 5
      },
      xaxis: {
        categories
      },
      yaxis: {
        title: {
          text: 'Valor'
        }
      },
      grid: {
        borderColor: '#e5e7eb'
      },
      tooltip: {
        enabled: true
      }
    };
  }

  normalizeSeries(report: ReportResponse): ApexAxisChartSeries {
    if (Array.isArray(report.series) && typeof report.series[0] === 'object') {
      return report.series as ReportSeriesItem[];
    }

    if (Array.isArray(report.series)) {
      return [
        {
          name: 'Valor',
          data: report.series as number[]
        }
      ];
    }

    return [];
  }

  buildDefaultCategories(series: ApexAxisChartSeries): string[] {
    const firstSeries = series[0];

    if (!firstSeries || !Array.isArray(firstSeries.data)) {
      return [];
    }

    return firstSeries.data.map((_, index) => `Dato ${index + 1}`);
  }
}