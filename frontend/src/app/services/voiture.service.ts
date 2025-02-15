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







  // for admin , photo , reviews ..
  getCarImageById(id: number): Observable<any> {
    return this.http.get<any>(`http://localhost:8084/api/photos/voiture/${id}`);
  }

  //  Added method for fetching a single voiture by ID
  getOneVoiture(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

    // Added method to fetch all voitures with details
    getAllVoituresWithDetails(): Observable<any> {
      return this.http.get(`${this.baseUrl}/all/details`);
    }








      // ✅ New method: Update Voiture with or without an image
  updateVoiture(id: number, voiture: any, file?: File): Observable<any> {
    const formData = new FormData();
    formData.append('voiture', new Blob([JSON.stringify(voiture)], { type: 'application/json' }));

    if (file) {
      formData.append('file', file);
    }

    return this.http.put(`${this.baseUrl}/${id}`, formData);
  }
}
