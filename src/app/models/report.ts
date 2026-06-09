export type ReportChartType = 'pie' | 'bar' | 'line' | 'series';

export interface ReportSeriesItem {
  name: string;
  data: number[];
}

export interface ReportResponse {
  type: ReportChartType;
  labels?: string[];
  series: number[] | ReportSeriesItem[];
  title?: string;
  subtitle?: string;
  message?: string;
}

export interface ReportRequest {
  query: string;
}