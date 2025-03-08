import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = 'http://localhost:8084/api/reviews';

  constructor(private http: HttpClient) {}

  /*Create a new review for a specific voiture */
  createReview(voitureId: number, review: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>): Observable<Review> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<Review>(`${this.apiUrl}/${voitureId}`, review, { headers });
  }
}
