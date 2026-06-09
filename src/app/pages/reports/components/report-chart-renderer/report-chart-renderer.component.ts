import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { ReportResponse } from 'src/app/models/report';
import { ReportPieChartComponent } from '../report-pie-chart/report-pie-chart.component';
import { ReportBarChartComponent } from '../report-bar-chart/report-bar-chart.component';
import { ReportLineChartComponent } from '../report-line-chart/report-line-chart.component';

@Component({
  selector: 'app-report-chart-renderer',
  standalone: true,
  imports: [
    CommonModule,
    ReportPieChartComponent,
    ReportBarChartComponent,
    ReportLineChartComponent
  ],
  templateUrl: './report-chart-renderer.component.html',
  styleUrl: './report-chart-renderer.component.scss'
})
export class ReportChartRendererComponent {

  @Input() report?: ReportResponse;
  @Input() question = '';

  get isGroupedBar(): boolean {
    if (!this.report || this.report.type !== 'bar' || !Array.isArray(this.report.series)) {
      return false;
    }

    return typeof this.report.series[0] === 'object' && this.report.series.length > 1;
  }

  get activeFormat(): string {
    if (!this.report) return '';

    if (this.report.type === 'pie') return 'Circular';
    if (this.report.type === 'line' || this.report.type === 'series') return 'Líneas';

    if (this.report.type === 'bar' && this.isGroupedBar) {
      return 'Barra agrupada';
    }

    return 'Barra simple';
  }

  applies(format: string): boolean {
    return this.activeFormat === format;
  }
}