import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { Evidence } from '../models/evidence';
import { DeleteResponse, PagedResponse, SearchParams } from '../models/api-response';

@Injectable({
  providedIn: 'root'
})
export class EvidencesService {
  private readonly apiUrl = `${environment.apiUrl}/api/evidences`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Evidence[]> {
    return this.http.get<Evidence[]>(this.apiUrl);
  }

  getPaged(page: number, pageSize: number): Observable<PagedResponse<Evidence>> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('pageSize', String(pageSize));

    return this.http.get<PagedResponse<Evidence>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Evidence> {
    return this.http.get<Evidence>(`${this.apiUrl}/${id}`);
  }

  search(filters: SearchParams, page: number = 1, pageSize: number = 5): Observable<PagedResponse<Evidence>> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('pageSize', String(pageSize));

    Object.keys(filters).forEach((key) => {
      const value = filters[key];
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return this.http.get<PagedResponse<Evidence>>(`${this.apiUrl}/search`, { params });
  }

  create(item: Partial<Evidence>): Observable<Evidence> {
    return this.http.post<Evidence>(this.apiUrl, item);
  }

  update(id: number, item: Partial<Evidence>): Observable<Evidence> {
    return this.http.put<Evidence>(`${this.apiUrl}/${id}`, item);
  }

  delete(id: number): Observable<DeleteResponse> {
    return this.http.delete<DeleteResponse>(`${this.apiUrl}/${id}`);
  }

  createWithFile(item: Partial<Evidence>, file: File): Observable<Evidence> {
    const formData = this.buildFormData(item, file);
    return this.http.post<Evidence>(this.apiUrl, formData);
  }

  updateWithFile(id: number, item: Partial<Evidence>, file: File): Observable<Evidence> {
    const formData = this.buildFormData(item, file);
    return this.http.put<Evidence>(`${this.apiUrl}/${id}`, formData);
  }

  private buildFormData(item: Partial<Evidence>, file: File): FormData {
    const formData = new FormData();

    Object.keys(item).forEach((key) => {
      const value = item[key as keyof Evidence];
      if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });

    formData.append('file', file);
    return formData;
  }
}
