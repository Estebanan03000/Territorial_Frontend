import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import {
  Official,
  OfficialTrackingStartResponse,
  OfficialTrackingStopResponse
} from '../models/official';
import { DeleteResponse, PagedResponse, SearchParams } from '../models/api-response';

@Injectable({
  providedIn: 'root'
})
export class OfficialsService {
  private readonly apiUrl = `${environment.apiUrl}/api/officials`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Official[]> {
    return this.http.get<Official[]>(this.apiUrl);
  }

  getPaged(page: number, pageSize: number): Observable<PagedResponse<Official>> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('pageSize', String(pageSize));

    return this.http.get<PagedResponse<Official>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Official> {
    return this.http.get<Official>(`${this.apiUrl}/${id}`);
  }

  search(filters: SearchParams, page: number = 1, pageSize: number = 5): Observable<PagedResponse<Official>> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('pageSize', String(pageSize));

    Object.keys(filters).forEach((key) => {
      const value = filters[key];
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return this.http.get<PagedResponse<Official>>(`${this.apiUrl}/search`, { params });
  }

  create(item: Partial<Official>): Observable<Official> {
    return this.http.post<Official>(this.apiUrl, item);
  }

  update(id: number, item: Partial<Official>): Observable<Official> {
    return this.http.put<Official>(`${this.apiUrl}/${id}`, item);
  }

  delete(id: number): Observable<DeleteResponse> {
    return this.http.delete<DeleteResponse>(`${this.apiUrl}/${id}`);
  }

  startTracking(ids: number[]): Observable<OfficialTrackingStartResponse> {
    return this.http.post<OfficialTrackingStartResponse>(`${this.apiUrl}/tracking/start`, { ids });
  }

  stopTracking(ids?: number[]): Observable<OfficialTrackingStopResponse> {
    return this.http.post<OfficialTrackingStopResponse>(`${this.apiUrl}/tracking/stop`, { ids });
  }
}
