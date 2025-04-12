import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8084/api/admin'; // Adjust based on your backend
  private tokenKey = 'access_token';

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(`${this.apiUrl}/login`, credentials, { headers }).pipe(
      tap((response: any) => {
        // Tokens or user info can be processed here if needed
      }),
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }



}
