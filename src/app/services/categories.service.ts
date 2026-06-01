import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { Category } from '../models/category';
import { DeleteResponse, PagedResponse, SearchParams } from '../models/api-response';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private readonly apiUrl = `${environment.apiUrl}/api/categories`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  getPaged(page: number, pageSize: number): Observable<PagedResponse<Category>> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('pageSize', String(pageSize));

    return this.http.get<PagedResponse<Category>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  search(filters: SearchParams, page: number = 1, pageSize: number = 5): Observable<PagedResponse<Category>> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('pageSize', String(pageSize));

    Object.keys(filters).forEach((key) => {
      const value = filters[key];
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return this.http.get<PagedResponse<Category>>(`${this.apiUrl}/search`, { params });
  }

  create(item: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, item);
  }

  update(id: number, item: Partial<Category>): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, item);
  }

  delete(id: number): Observable<DeleteResponse> {
    return this.http.delete<DeleteResponse>(`${this.apiUrl}/${id}`);
  }

  createWithFile(item: Partial<Category>, file: File): Observable<Category> {
    const formData = this.buildFormData(item, file);
    return this.http.post<Category>(this.apiUrl, formData);
  }

  updateWithFile(id: number, item: Partial<Category>, file: File): Observable<Category> {
    const formData = this.buildFormData(item, file);
    return this.http.put<Category>(`${this.apiUrl}/${id}`, formData);
  }

  private buildFormData(item: Partial<Category>, file: File): FormData {
    const formData = new FormData();

    Object.keys(item).forEach((key) => {
      const value = item[key as keyof Category];
      if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });

    formData.append('file', file);
    return formData;
  }
}
