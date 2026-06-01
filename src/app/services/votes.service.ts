import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { Vote } from '../models/vote';
import { DeleteResponse, PagedResponse, SearchParams } from '../models/api-response';

@Injectable({
  providedIn: 'root'
})
export class VotesService {
  private readonly apiUrl = `${environment.apiUrl}/api/votes`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Vote[]> {
    return this.http.get<Vote[]>(this.apiUrl);
  }

  getPaged(page: number, pageSize: number): Observable<PagedResponse<Vote>> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('pageSize', String(pageSize));

    return this.http.get<PagedResponse<Vote>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Vote> {
    return this.http.get<Vote>(`${this.apiUrl}/${id}`);
  }

  search(filters: SearchParams, page: number = 1, pageSize: number = 5): Observable<PagedResponse<Vote>> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('pageSize', String(pageSize));

    Object.keys(filters).forEach((key) => {
      const value = filters[key];
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return this.http.get<PagedResponse<Vote>>(`${this.apiUrl}/search`, { params });
  }

  create(item: Partial<Vote>): Observable<Vote> {
    return this.http.post<Vote>(this.apiUrl, item);
  }

  update(id: number, item: Partial<Vote>): Observable<Vote> {
    return this.http.put<Vote>(`${this.apiUrl}/${id}`, item);
  }

  delete(id: number): Observable<DeleteResponse> {
    return this.http.delete<DeleteResponse>(`${this.apiUrl}/${id}`);
  }
}
