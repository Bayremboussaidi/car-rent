import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private keycloakUrl = 'http://192.168.100.248:8080';
  private realm = 'comparateur';
  private clientId = 'location';
  private clientSecret = 'z1GlcCIOjQNeibhAZiS3nXTtp03JLZqz';
  private adminToken = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJSdVc3YmFYd3RuS2FTcG83Y3RJc3oyX3Q4MlNGSEN2SVlFWnNucmM2bklRIn0.eyJleHAiOjE3NDA5MTkyMDIsImlhdCI6MTc0MDkxODkwMiwianRpIjoiOTNjNzZhYTQtNGQ3MC00NjZkLWIwY2QtYTY2ZDc0OWIxM2IxIiwiaXNzIjoiaHR0cDovLzE5Mi4xNjguMTAwLjI0ODo4MDgwL3JlYWxtcy9jb21wYXJhdGV1ciIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiJjYzExZjRlMy1hMGFiLTQzNWYtYjdlZC05N2Y2MDRlODMwN2UiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJsb2NhdGlvbiIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo0MjAwIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIiwiZGVmYXVsdC1yb2xlcy1jb21wYXJhdGV1ciJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoiZW1haWwgcHJvZmlsZSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiY2xpZW50SG9zdCI6IjE5Mi4xNjguMTAwLjExNyIsInByZWZlcnJlZF91c2VybmFtZSI6InNlcnZpY2UtYWNjb3VudC1sb2NhdGlvbiIsImNsaWVudEFkZHJlc3MiOiIxOTIuMTY4LjEwMC4xMTciLCJjbGllbnRfaWQiOiJsb2NhdGlvbiJ9.NIGVvrH-wagHzf8iR12mwzV1HS1K9uxaJzyLY14dZ6-cSxj_5g76ueIn1njXOVyqEMY_jXohK8xGOrOOrMdL3AxqqmU-D5XnNYLq5r2WNtOPTfwhU37AuTtnpcYIbPwGiafwNwrNCIEnSpsBdf9Aspha2NoPIx6ytRQY9e_OYjQVZcc7i4BQB_aTi9tei0n8vPya2XpoBOrElUXHZZo6og5YaZiVQAn6kNPZsQSo8JTOJj91tBJJn6JwFm5Y-82Etw9UPr4kbkcVpVfvI0MsXoADUQVK-kB41RuSWLST5h1X6Szh2HmcsqE5FWt-voAW2AGcjYUtmuZf2pHJeAwGzw';

  constructor(private http: HttpClient, private router: Router) {}

  // 1️⃣ **LOGIN (Authenticate User via Keycloak API)**
  login(credentials: { email: string; password: string }): Observable<boolean> {
    const url = `${this.keycloakUrl}/realms/${this.realm}/protocol/openid-connect/token`;

    const body = new URLSearchParams();
    body.set('client_id', this.clientId);
    body.set('client_secret', this.clientSecret);
    body.set('grant_type', 'password');
    body.set('username', credentials.email);
    body.set('password', credentials.password);

    return this.http.post(url, body.toString(), {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
    }).pipe(
      map((response: any) => {
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('refresh_token', response.refresh_token);
        localStorage.setItem('role', this.extractRole(response.access_token));
        return true;
      }),
      catchError((error) => {
        console.error('Login error:', error);
        return throwError(error);
      })
    );
  }

  // 2️⃣ **REGISTER (Create User in Keycloak)**
  register(credentials: { username: string; email: string; password: string; phone: number }): Observable<any> {
    const url = `${this.keycloakUrl}/admin/realms/${this.realm}/users`;

    const user = {
      username: credentials.username,
      email: credentials.email,
      firstName: credentials.username,
      enabled: true,
      credentials: [{ type: 'password', value: credentials.password, temporary: false }],
      attributes: { phone: [credentials.phone.toString()] },
    };

    return this.http.post(url, user, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.adminToken}`, // Keycloak Admin Token
        'Content-Type': 'application/json',
      }),
    }).pipe(
      catchError((error) => {
        console.error('Registration error:', error);
        return throwError(error);
      })
    );
  }

  // 3️⃣ **LOGOUT (Clear Tokens & Redirect)**
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }

  // 4️⃣ **EXTRACT ROLE FROM JWT TOKEN**
  private extractRole(token: string): string {
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      return decodedToken?.realm_access?.roles?.find((role: string) =>
        ['ADMIN', 'USER', 'AGENCE'].includes(role)
      ) || 'USER';
    } catch (error) {
      console.error('Error decoding token:', error);
      return 'USER';
    }
  }

  // 5️⃣ **GET USER ROLE FROM LOCAL STORAGE**
  getRole(): string | null {
    return localStorage.getItem('role');
  }

  // 6️⃣ **REFRESH TOKEN WHEN EXPIRED**
  refreshToken(): Observable<any> {
    const url = `${this.keycloakUrl}/realms/${this.realm}/protocol/openid-connect/token`;

    const body = new URLSearchParams();
    body.set('client_id', this.clientId);
    body.set('client_secret', this.clientSecret);
    body.set('grant_type', 'refresh_token');
    body.set('refresh_token', localStorage.getItem('refresh_token') || '');

    return this.http.post(url, body.toString(), {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
    }).pipe(
      map((response: any) => {
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('refresh_token', response.refresh_token);
        return response;
      }),
      catchError((error) => {
        console.error('Refresh token error:', error);
        this.logout();
        return throwError(error);
      })
    );
  }
}
