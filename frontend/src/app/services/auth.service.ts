import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { email: string; password: string }): Observable<boolean> {
    return this.http.post('http://localhost:8084/api/login', credentials).pipe(
      map((response: any) => {
        localStorage.setItem('role', response.role); // Store role in localStorage
        return true;
      }),
      catchError((error) => {
        console.error('Login error:', error);
        return [false];
      })
    );
  }

  getRole(): string | null {
    return localStorage.getItem('role'); // Retrieve role from localStorage
  }

  logout() {
    localStorage.removeItem('role'); // Clear stored role
    this.router.navigate(['/login']);
  }

  register(credentials: { username: string; email: string; password: string; phone: number; }): Observable<any> {
    const user = {
      username: credentials.username,
      email: credentials.email,
      password: credentials.password,
      phone: credentials.phone,
      photo: ' ',
      role: 'USER'
    };

    return this.http.post('http://localhost:8084/api/users', user);
  }
}
