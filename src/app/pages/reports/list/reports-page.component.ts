import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { ReportResponse } from 'src/app/models/report';
import { ReportChatComponent } from '../components/report-chat/report-chat.component';
import { ReportChartRendererComponent } from '../components/report-chart-renderer/report-chart-renderer.component';

@Component({
  selector: 'app-reports-page',
  standalone: true,
  imports: [CommonModule, ReportChatComponent, ReportChartRendererComponent],
  templateUrl: './reports-page.component.html',
  styleUrl: './reports-page.component.scss'
})
export class ReportsPageComponent {
  currentReport?: ReportResponse;
  currentQuestion = '';

  onReportGenerated(event: { query: string; report: ReportResponse }): void {
    this.currentQuestion = event.query;
    this.currentReport = event.report;
  }
}