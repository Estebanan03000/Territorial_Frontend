import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { Entity } from '../models/entity';
import { DeleteResponse, PagedResponse, SearchParams } from '../models/api-response';

@Injectable({
  providedIn: 'root'
})
export class EntitiesService {
  private readonly apiUrl = `${environment.apiUrl}/api/entities`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Entity[]> {
    return this.http.get<Entity[]>(this.apiUrl);
  }

  getPaged(page: number, pageSize: number): Observable<PagedResponse<Entity>> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('pageSize', String(pageSize));

    return this.http.get<PagedResponse<Entity>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Entity> {
    return this.http.get<Entity>(`${this.apiUrl}/${id}`);
  }

  search(filters: SearchParams, page: number = 1, pageSize: number = 5): Observable<PagedResponse<Entity>> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('pageSize', String(pageSize));

    Object.keys(filters).forEach((key) => {
      const value = filters[key];
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return this.http.get<PagedResponse<Entity>>(`${this.apiUrl}/search`, { params });
  }

  create(item: Partial<Entity>): Observable<Entity> {
    return this.http.post<Entity>(this.apiUrl, item);
  }

  update(id: number, item: Partial<Entity>): Observable<Entity> {
    return this.http.put<Entity>(`${this.apiUrl}/${id}`, item);
  }

  delete(id: number): Observable<DeleteResponse> {
    return this.http.delete<DeleteResponse>(`${this.apiUrl}/${id}`);
  }

  createWithFile(item: Partial<Entity>, file: File): Observable<Entity> {
    const formData = this.buildFormData(item, file);
    return this.http.post<Entity>(this.apiUrl, formData);
  }

  updateWithFile(id: number, item: Partial<Entity>, file: File): Observable<Entity> {
    const formData = this.buildFormData(item, file);
    return this.http.put<Entity>(`${this.apiUrl}/${id}`, formData);
  }

  private buildFormData(item: Partial<Entity>, file: File): FormData {
    const formData = new FormData();

    Object.keys(item).forEach((key) => {
      const value = item[key as keyof Entity];
      if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });

    formData.append('file', file);
    return formData;
  }
}
