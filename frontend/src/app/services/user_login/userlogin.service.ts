import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserloginService {
  private apiUrl = 'http://localhost:8084/api/auth';

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        console.log('Login response:', response); // Log response
        localStorage.setItem('auth_token', response.token);
      }),
      catchError(error => {
        return throwError(() => error.error?.message || 'Login failed');
      })
    );
  }
}
