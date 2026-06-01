import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { AnnotationCategory } from '../models/annotation-category';
import { DeleteResponse, PagedResponse, SearchParams } from '../models/api-response';

@Injectable({
  providedIn: 'root'
})
export class AnnotationCategoriesService {
  private readonly apiUrl = `${environment.apiUrl}/api/annotation-categories`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<AnnotationCategory[]> {
    return this.http.get<AnnotationCategory[]>(this.apiUrl);
  }

  getPaged(page: number, pageSize: number): Observable<PagedResponse<AnnotationCategory>> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('pageSize', String(pageSize));

    return this.http.get<PagedResponse<AnnotationCategory>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<AnnotationCategory> {
    return this.http.get<AnnotationCategory>(`${this.apiUrl}/${id}`);
  }

  search(filters: SearchParams, page: number = 1, pageSize: number = 5): Observable<PagedResponse<AnnotationCategory>> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('pageSize', String(pageSize));

    Object.keys(filters).forEach((key) => {
      const value = filters[key];
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return this.http.get<PagedResponse<AnnotationCategory>>(`${this.apiUrl}/search`, { params });
  }

  create(item: Partial<AnnotationCategory>): Observable<AnnotationCategory> {
    return this.http.post<AnnotationCategory>(this.apiUrl, item);
  }

  update(id: number, item: Partial<AnnotationCategory>): Observable<AnnotationCategory> {
    return this.http.put<AnnotationCategory>(`${this.apiUrl}/${id}`, item);
  }

  delete(id: number): Observable<DeleteResponse> {
    return this.http.delete<DeleteResponse>(`${this.apiUrl}/${id}`);
  }
}
