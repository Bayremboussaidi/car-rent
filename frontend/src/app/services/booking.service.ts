import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:8084/api/bookings'; // Adjust the backend URL if needed

  constructor(private http: HttpClient) {}

  createBooking(voitureId: number, bookingData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${voitureId}`, bookingData);
  }

  getAllBookings(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/all`); // Ensure the correct endpoint
  }

  updateBookingStatus(id: number, status: string): Observable<any> {
    const requestBody = { status }; // Send status as JSON
    return this.http.put<any>(`${this.apiUrl}/${id}/status`, requestBody);
  }
}
