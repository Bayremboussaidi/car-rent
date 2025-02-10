import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VoitureService {
  private baseUrl = 'http://localhost:8084/api/voitures';

  constructor(private http: HttpClient) {}

  getVoitures(page: number): Observable<any> {
    return this.http.get(`${this.baseUrl}?page=${page}`);
  }

  getVoitureCount(): Observable<any> {
    return this.http.get(`${this.baseUrl}/search/getVoitureCount`);
  }

  getVoitureById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  addVoiture(voiture: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, voiture);
  }

  getCarImageById(id: number): Observable<any> {
    return this.http.get<any>(`http://localhost:8084/api/photos/voiture/${id}`);
  }
}
