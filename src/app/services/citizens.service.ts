import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { Citizen } from '../models/citizen';
import { DeleteResponse, PagedResponse, SearchParams } from '../models/api-response';

@Injectable({
  providedIn: 'root'
})
export class CitizensService {
  private readonly apiUrl = `${environment.apiUrl}/api/citizens`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Citizen[]> {
    return this.http.get<Citizen[]>(this.apiUrl);
  }

  getPaged(page: number, pageSize: number): Observable<PagedResponse<Citizen>> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('pageSize', String(pageSize));

    return this.http.get<PagedResponse<Citizen>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Citizen> {
    return this.http.get<Citizen>(`${this.apiUrl}/${id}`);
  }

  search(filters: SearchParams, page: number = 1, pageSize: number = 5): Observable<PagedResponse<Citizen>> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('pageSize', String(pageSize));

    Object.keys(filters).forEach((key) => {
      const value = filters[key];
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return this.http.get<PagedResponse<Citizen>>(`${this.apiUrl}/search`, { params });
  }

  create(item: Partial<Citizen>): Observable<Citizen> {
    return this.http.post<Citizen>(this.apiUrl, item);
  }

  update(id: number, item: Partial<Citizen>): Observable<Citizen> {
    return this.http.put<Citizen>(`${this.apiUrl}/${id}`, item);
  }

  delete(id: number): Observable<DeleteResponse> {
    return this.http.delete<DeleteResponse>(`${this.apiUrl}/${id}`);
  }
}
