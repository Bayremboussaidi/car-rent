import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private keycloakUrl = 'http://192.168.100.248:8080';
  private realm = 'comparateur';
  private clientId = 'location';
  private clientSecret = 'z1GlcCIOjQNeibhAZiS3nXTtp03JLZqz';
  private adminToken = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJSdVc3YmFYd3RuS2FTcG83Y3RJc3oyX3Q4MlNGSEN2SVlFWnNucmM2bklRIn0.eyJleHAiOjE3NDEwMjcxMDcsImlhdCI6MTc0MTAyNjgwNywianRpIjoiNDY5ZjQ5MTMtYzQ2ZC00YmNkLTk2MTAtMzFhNzMyYmFiNGQ5IiwiaXNzIjoiaHR0cDovLzE5Mi4xNjguMTAwLjI0ODo4MDgwL3JlYWxtcy9jb21wYXJhdGV1ciIsImF1ZCI6WyJyZWFsbS1tYW5hZ2VtZW50IiwiYWNjb3VudCJdLCJzdWIiOiJjYzExZjRlMy1hMGFiLTQzNWYtYjdlZC05N2Y2MDRlODMwN2UiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJsb2NhdGlvbiIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo0MjAwIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIiwiZGVmYXVsdC1yb2xlcy1jb21wYXJhdGV1ciJdfSwicmVzb3VyY2VfYWNjZXNzIjp7InJlYWxtLW1hbmFnZW1lbnQiOnsicm9sZXMiOlsibWFuYWdlLWV2ZW50cyIsIm1hbmFnZS1yZWFsbSIsIm1hbmFnZS1pZGVudGl0eS1wcm92aWRlcnMiLCJpbXBlcnNvbmF0aW9uIiwiY3JlYXRlLWNsaWVudCIsIm1hbmFnZS11c2VycyIsIm1hbmFnZS1hdXRob3JpemF0aW9uIiwicXVlcnktY2xpZW50cyIsIm1hbmFnZS1jbGllbnRzIiwicXVlcnktZ3JvdXBzIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6ImVtYWlsIHByb2ZpbGUiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImNsaWVudEhvc3QiOiIxOTIuMTY4LjEwMC4xMTciLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJzZXJ2aWNlLWFjY291bnQtbG9jYXRpb24iLCJjbGllbnRBZGRyZXNzIjoiMTkyLjE2OC4xMDAuMTE3IiwiY2xpZW50X2lkIjoibG9jYXRpb24ifQ.ezuOtgoh3OABAARbkuEEZWMGYJ79QxZ0sCtpeuUaSzTXUv_NLvhk_N9wB63yqF2PoCFKcFhA3054nqIVRPb2lRkNMDjihcYGi0q94-ntcYHwm79duffD_H5Z1FZGj680oSNKDaHlDOyCHv6SJkUOcoSelaGHWjibC9edmIEYmyFetASJ468Jkhj3DNWqAs1fz2mxtTAwEEVevHkHLN1B8jdiqOPC3eOqP4FhEGcIYSZuvbO24BgWWsRrOXJSjsZl5fKJ8CtcSEDPeixiKhAU4ms8RW23yVEMXKPg_mT8_L0urW5lreUa1cLRyWbZrU8kWsQMwlYpwovqzcEe5vbPQg'; // Replace with a dynamic token
  private backendApiUrl = 'http://localhost:8084/api/users/register'; // Backend for MySQL storage

  constructor(private http: HttpClient, private router: Router) {}

  // ✅ Register User (Keycloak + MySQL)
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
      switchMap(() => this.getUserIdByUsername(user.username!)), // Get Keycloak User ID
      switchMap(userId => this.addUserToGroup(userId)), // Add to 'USER' group
      switchMap(() => this.storeUserDetailsInDB(user)), // Store full details in MySQL
      catchError(error => {
        console.error('❌ Registration failed:', error);
        return throwError(error);
      })
    );
  }

  // ✅ Get Keycloak User ID by Username
  private getUserIdByUsername(username: string): Observable<string> {
    const url = `${this.keycloakUrl}/admin/realms/${this.realm}/users?username=${username}`;

    return this.http.get<any[]>(url, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.adminToken}`,
        'Content-Type': 'application/json',
      }),
    }).pipe(
      map(users => {
        if (users.length > 0) {
          return users[0].id;
        } else {
          throw new Error('User not found in Keycloak');
        }
      }),
      catchError(error => {
        console.error('❌ Error retrieving user ID:', error);
        return throwError(error);
      })
    );
  }

  // ✅ Add User to 'USER' Group in Keycloak
  private addUserToGroup(userId: string): Observable<any> {
    const groupId = 'feb5049b-205a-4500-84ef-366d0e8a276d'; // Retrieve from Keycloak Admin Panel
    const url = `${this.keycloakUrl}/admin/realms/${this.realm}/users/${userId}/groups/${groupId}`;

    return this.http.put(url, {}, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.adminToken}`,
      }),
    }).pipe(
      map(response => {
        console.log(`✅ User added to 'USER' group:`, response);
        return response;
      }),
      catchError(error => {
        console.error('❌ Error adding user to group:', error);
        return throwError(error);
      })
    );
  }

  // ✅ Store Full User Details in MySQL
  private storeUserDetailsInDB(user: Partial<User>): Observable<any> {
    return this.http.post(this.backendApiUrl, user, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    }).pipe(
      map(response => {
        console.log("✅ User details stored in MySQL:", response);
        return response;
      }),
      catchError(error => {
        console.error('❌ Error storing user details in MySQL:', error);
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
