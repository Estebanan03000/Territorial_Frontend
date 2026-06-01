import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { Point } from '../models/point';
import { DeleteResponse, PagedResponse, SearchParams } from '../models/api-response';

@Injectable({
  providedIn: 'root'
})
export class PointsService {
  private readonly apiUrl = `${environment.apiUrl}/api/points`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Point[]> {
    return this.http.get<Point[]>(this.apiUrl);
  }

  getPaged(page: number, pageSize: number): Observable<PagedResponse<Point>> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('pageSize', String(pageSize));

    return this.http.get<PagedResponse<Point>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Point> {
    return this.http.get<Point>(`${this.apiUrl}/${id}`);
  }

  search(filters: SearchParams, page: number = 1, pageSize: number = 5): Observable<PagedResponse<Point>> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('pageSize', String(pageSize));

    Object.keys(filters).forEach((key) => {
      const value = filters[key];
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return this.http.get<PagedResponse<Point>>(`${this.apiUrl}/search`, { params });
  }

  create(item: Partial<Point>): Observable<Point> {
    return this.http.post<Point>(this.apiUrl, item);
  }

  update(id: number, item: Partial<Point>): Observable<Point> {
    return this.http.put<Point>(`${this.apiUrl}/${id}`, item);
  }

  delete(id: number): Observable<DeleteResponse> {
    return this.http.delete<DeleteResponse>(`${this.apiUrl}/${id}`);
  }
}
