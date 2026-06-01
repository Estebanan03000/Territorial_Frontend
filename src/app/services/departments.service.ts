import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { Department } from '../models/department';
import { DeleteResponse, PagedResponse, SearchParams } from '../models/api-response';

@Injectable({
  providedIn: 'root'
})
export class DepartmentsService {
  private readonly apiUrl = `${environment.apiUrl}/api/departments`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Department[]> {
    return this.http.get<Department[]>(this.apiUrl);
  }

  getPaged(page: number, pageSize: number): Observable<PagedResponse<Department>> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('pageSize', String(pageSize));

    return this.http.get<PagedResponse<Department>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Department> {
    return this.http.get<Department>(`${this.apiUrl}/${id}`);
  }

  search(filters: SearchParams, page: number = 1, pageSize: number = 5): Observable<PagedResponse<Department>> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('pageSize', String(pageSize));

    Object.keys(filters).forEach((key) => {
      const value = filters[key];
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return this.http.get<PagedResponse<Department>>(`${this.apiUrl}/search`, { params });
  }

  create(item: Partial<Department>): Observable<Department> {
    return this.http.post<Department>(this.apiUrl, item);
  }

  update(id: number, item: Partial<Department>): Observable<Department> {
    return this.http.put<Department>(`${this.apiUrl}/${id}`, item);
  }

  delete(id: number): Observable<DeleteResponse> {
    return this.http.delete<DeleteResponse>(`${this.apiUrl}/${id}`);
  }
}
