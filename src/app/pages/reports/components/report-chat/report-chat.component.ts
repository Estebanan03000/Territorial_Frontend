import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import Swal from 'sweetalert2';

import { ReportResponse } from 'src/app/models/report';
import { ReportsService } from 'src/app/services/reports.service';

type ChatMessage = {
  sender: 'user' | 'system';
  text: string;
};

@Component({
  selector: 'app-report-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './report-chat.component.html',
  styleUrl: './report-chat.component.scss'
})
export class ReportChatComponent {

  @Output() reportGenerated = new EventEmitter<{ query: string; report: ReportResponse }>();

  query = '';
  loading = false;

  messages: ChatMessage[] = [];

  examples: string[] = [
    'barrios con mas puntos críticos',
    'porcentaje de ciudadanos activos e inactivos',
    'comunas con mas barrios',
    'comparación de puntos críticos entre barrios',
    'cantidad de barrios por comuna'
  ];

  constructor(private reportsService: ReportsService) {}

  sendQuery(): void {
    const cleanQuery = this.query.trim();

    if (!cleanQuery) {
      Swal.fire('Consulta vacía', 'Escribe una pregunta para generar el reporte.', 'warning');
      return;
    }

    this.messages.push({
      sender: 'user',
      text: cleanQuery
    });

    this.loading = true;

    this.reportsService.generateReport(cleanQuery).subscribe({
      next: (report) => {
        this.loading = false;

        this.messages.push({
          sender: 'system',
          text: this.getSystemMessage(report)
        });

        this.reportGenerated.emit({
          query: cleanQuery,
          report
        });

        this.query = '';
      },
      error: (error: any) => {
        this.loading = false;

        const message = this.getErrorMessage(error);

        this.messages.push({
          sender: 'system',
          text: message
        });

        Swal.fire('No se pudo generar el reporte', message, 'error');
      }
    });
  }

  useExample(example: string): void {
    this.query = example;
  }

  getSystemMessage(report: ReportResponse): string {
    if (report.message) {
      return report.message;
    }

    if (report.type === 'pie') {
      return 'Se generó un reporte de distribución proporcional en gráfica circular.';
    }

    if (report.type === 'bar') {
      return 'Se generó un reporte comparativo en gráfica de barras.';
    }

    if (report.type === 'line') {
      return 'Se generó un reporte de tendencia temporal en gráfica de líneas.';
    }

    return 'Se generó el reporte solicitado.';
  }

  getErrorMessage(error: any): string {
    const backendMessage =
      error?.error?.message ||
      error?.error?.error ||
      error?.message ||
      '';

    if (
      error?.status === 429 ||
      backendMessage.includes('429') ||
      backendMessage.includes('RESOURCE_EXHAUSTED') ||
      backendMessage.toLowerCase().includes('quota exceeded') ||
      backendMessage.toLowerCase().includes('current quota')
    ) {
      return 'Gemini alcanzó la cuota de uso de la API key. Espera unos minutos o prueba con otra clave.';
    }

    if (
      error?.status === 503 ||
      backendMessage.includes('503') ||
      backendMessage.includes('UNAVAILABLE') ||
      backendMessage.toLowerCase().includes('high demand')
    ) {
      return 'Gemini está temporalmente ocupado por alta demanda. Intenta nuevamente en unos minutos.';
    }

    if (error?.status === 400) {
      return backendMessage || 'La consulta está vacía o no pudo procesarse. Reformúlala e intenta de nuevo.';
    }

    if (error?.status === 502) {
      return backendMessage || 'No se pudo conectar con Gemini. Verifica la API key o la conexión del backend.';
    }

    if (error?.status === 500) {
      return backendMessage || 'Ocurrió un error interno procesando la consulta.';
    }

    return backendMessage || 'Ocurrió un error procesando la consulta.';
  }
}