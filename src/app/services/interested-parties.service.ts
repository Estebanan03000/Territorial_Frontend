import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { InterestedParty } from '../models/interested-party';
import { DeleteResponse, PagedResponse, SearchParams } from '../models/api-response';

@Injectable({
  providedIn: 'root'
})
export class InterestedPartiesService {
  private readonly apiUrl = `${environment.apiUrl}/api/interested-parties`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<InterestedParty[]> {
    return this.http.get<InterestedParty[]>(this.apiUrl);
  }

  getPaged(page: number, pageSize: number): Observable<PagedResponse<InterestedParty>> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('pageSize', String(pageSize));

    return this.http.get<PagedResponse<InterestedParty>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<InterestedParty> {
    return this.http.get<InterestedParty>(`${this.apiUrl}/${id}`);
  }

  search(filters: SearchParams, page: number = 1, pageSize: number = 5): Observable<PagedResponse<InterestedParty>> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('pageSize', String(pageSize));

    Object.keys(filters).forEach((key) => {
      const value = filters[key];
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return this.http.get<PagedResponse<InterestedParty>>(`${this.apiUrl}/search`, { params });
  }

  create(item: Partial<InterestedParty>): Observable<InterestedParty> {
    return this.http.post<InterestedParty>(this.apiUrl, item);
  }

  update(id: number, item: Partial<InterestedParty>): Observable<InterestedParty> {
    return this.http.put<InterestedParty>(`${this.apiUrl}/${id}`, item);
  }

  delete(id: number): Observable<DeleteResponse> {
    return this.http.delete<DeleteResponse>(`${this.apiUrl}/${id}`);
  }
}
