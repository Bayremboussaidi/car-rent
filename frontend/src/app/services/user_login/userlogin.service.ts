import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { User } from '../../models/user.model';

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







  /*teb3in Notifications*/
  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }


  /*Get current User */
  getCurrentUser(): User | null {
    const token = localStorage.getItem('auth_token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.sub,
        username: payload.preferred_username,
        firstName: payload.given_name,
        lastName: payload.family_name,
        email: payload.email,
        phone: payload.phone_number,
        workplace: payload.workplace,
        role: this.extractRole(token)
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  private extractRole(token: string): 'ADMIN' | 'USER' | 'AGENCE' {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role as 'ADMIN' | 'USER' | 'AGENCE' || 'USER'; // Default to 'USER' if role is not found
    } catch (error) {
      console.error('Error extracting role from token:', error);
      return 'USER'; // Default to 'USER' in case of error
    }
  }

}
