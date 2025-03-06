import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private keycloakUrl = 'https://192.168.100.248:8443';

  private realm = 'comparateur';
  private clientId = 'location';
  private clientSecret = 'z1GlcCIOjQNeibhAZiS3nXTtp03JLZqz';

  constructor(private http: HttpClient, private router: Router) {}

  /*
  // ❌ Previous Method: Register via Admin API (Commented Out)
  register(user: Partial<User>): Observable<any> {
    const url = `${this.keycloakUrl}/admin/realms/${this.realm}/users`;

    const keycloakUser = {
      username: user.username ?? '',
      email: user.email ?? '',
      firstName: user.username ?? '',
      enabled: true,
      credentials: [{ type: 'password', value: user.password ?? '', temporary: false }],
    };

    return this.http.post(url, keycloakUser, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.adminToken}`,
        'Content-Type': 'application/json',
      }),
    }).pipe(
      catchError(error => {
        console.error('❌ Registration failed:', error);
        return throwError(error);
      })
    );
  }
  */

  // ✅ New Method: Register User via Direct Access Grants API
  register(user: Partial<User>): Observable<any> {
    const adminLoginUrl = `${this.keycloakUrl}/realms/master/protocol/openid-connect/token`;
    const createUserUrl = `${this.keycloakUrl}/admin/realms/${this.realm}/users`;

    // Get an admin access token
    const body = new URLSearchParams();
    body.set('client_id', 'admin');  // Use admin-cli for managing users
    body.set('username', 'admin');  // Admin username
    body.set('password', 'admin');  // Admin password
    body.set('grant_type', 'password');

    return this.http.post(adminLoginUrl, body.toString(), {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
    }).pipe(
        map((tokenResponse: any) => {
            console.log("✅ Admin Token Received:", tokenResponse);
            const adminToken = tokenResponse.access_token;

            // Create user payload
            const keycloakUser = {
                username: user.username ?? '',
                firstName: user.firstName ?? '',
                lastName: user.lastName ?? '',
                email: user.email ?? '',
                enabled: true,
                credentials: [{ type: 'password', value: user.password ?? '', temporary: false }],
            };

            // Register user with the admin token
            return this.http.post(createUserUrl, keycloakUser, {
                headers: new HttpHeaders({
                    Authorization: `Bearer ${adminToken}`,
                    'Content-Type': 'application/json',
                }),
            });
        }),
        catchError(error => {
            console.error("❌ Registration Failed:", error);
            return throwError(error);
        })
    );
}


  // ✅ Login (Authenticate User via Keycloak API)
  login(credentials: { email: string; password: string }): Observable<boolean> {
    const url = `${this.keycloakUrl}/realms/${this.realm}/protocol/openid-connect/token`;

    const body = new URLSearchParams();
    body.set('client_id', this.clientId);
    body.set('client_secret', this.clientSecret);
    body.set('grant_type', 'password');
    body.set('username', credentials.email);
    body.set('password', credentials.password);
    body.set('scope', 'openid offline_access');

    return this.http.post(url, body.toString(), {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
    }).pipe(
      map((response: any) => {
        console.log("✅ Login successful:", response);
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('refresh_token', response.refresh_token);
        localStorage.setItem('role', this.extractRole(response.access_token));
        return true;
      }),
      catchError((error) => {
        console.error('❌ Login error:', error);
        return throwError(error);
      })
    );
  }

  // ✅ Logout (Clear Tokens & Redirect)
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }

  // ✅ Extract Role from JWT Token
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

  // ✅ Get User Role from Local Storage
  getRole(): string | null {
    return localStorage.getItem('role');
  }

  // ✅ Refresh Token When Expired
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
