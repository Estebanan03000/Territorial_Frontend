import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexDataLabels,
  ApexPlotOptions,
  ApexGrid,
  ApexTooltip,
  NgApexchartsModule
} from 'ng-apexcharts';

import { ReportResponse, ReportSeriesItem } from 'src/app/models/report';

type BarChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  grid: ApexGrid;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-report-bar-chart',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './report-bar-chart.component.html',
  styleUrl: './report-bar-chart.component.scss'
})
export class ReportBarChartComponent implements OnChanges {

  @Input() report?: ReportResponse;

  chartOptions?: Partial<BarChartOptions>;

  ngOnChanges(): void {
    if (!this.report) return;

    const series = this.normalizeSeries(this.report);
    const categories = this.report.labels || this.buildDefaultCategories(series);

    this.chartOptions = {
      series,
      chart: {
        type: 'bar',
        height: 380,
        toolbar: {
          show: true
        }
      },
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 4
        }
      },
      dataLabels: {
        enabled: true
      },
      xaxis: {
        categories
      },
      yaxis: {
        title: {
          text: 'Categoría'
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