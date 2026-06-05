import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environments';
import { Commune, CommunePayload } from '../models/commune';
import { DeleteResponse, PagedResponse, SearchParams } from '../models/api-response';

@Injectable({
  providedIn: 'root',
})
export class CommunesService {
  private readonly apiUrl = `${environment.apiUrl}/api/communes`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Commune[]> {
    return this.http.get<Commune[]>(this.apiUrl);
  }

  getPaged(page: number, pageSize: number): Observable<PagedResponse<Commune>> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('pageSize', String(pageSize));

    return this.http.get<PagedResponse<Commune>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Commune> {
    return this.http.get<Commune>(`${this.apiUrl}/${id}`);
  }

  search(
    filters: SearchParams,
    page: number = 1,
    pageSize: number = 10
  ): Observable<PagedResponse<Commune>> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('pageSize', String(pageSize));

    Object.keys(filters).forEach((key) => {
      const value = filters[key];

      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return this.http.get<PagedResponse<Commune>>(`${this.apiUrl}/search`, {
      params,
    });
  }

  create(item: CommunePayload): Observable<Commune> {
    return this.http.post<Commune>(this.apiUrl, item);
  }

  update(id: number, item: CommunePayload): Observable<Commune> {
    return this.http.put<Commune>(`${this.apiUrl}/${id}`, item);
  }

  delete(id: number): Observable<DeleteResponse> {
    return this.http.delete<DeleteResponse>(`${this.apiUrl}/${id}`);
  }

  changeStatus(commune: Commune, status: string): Observable<Commune> {
    const payload: CommunePayload = {
      id_city: Number(commune.id_city),
      name: commune.name || '',
      status,
    };

    return this.update(Number(commune.id_commune), payload);
  }
}