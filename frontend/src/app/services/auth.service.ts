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
  private keycloakUrl = 'http://192.168.100.248:8080';
  private realm = 'comparateur';
  private clientId = 'location';
  private clientSecret = 'z1GlcCIOjQNeibhAZiS3nXTtp03JLZqz';
  private adminToken = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJSdVc3YmFYd3RuS2FTcG83Y3RJc3oyX3Q4MlNGSEN2SVlFWnNucmM2bklRIn0.eyJleHAiOjE3NDA5NzEzMzcsImlhdCI6MTc0MDk3MTAzNywianRpIjoiYTRkNTU3ZDgtNDMxOC00YmIwLWE0MjUtNWZmMGNhMTBlOWQyIiwiaXNzIjoiaHR0cDovLzE5Mi4xNjguMTAwLjI0ODo4MDgwL3JlYWxtcy9jb21wYXJhdGV1ciIsImF1ZCI6WyJyZWFsbS1tYW5hZ2VtZW50IiwiYWNjb3VudCJdLCJzdWIiOiJjYzExZjRlMy1hMGFiLTQzNWYtYjdlZC05N2Y2MDRlODMwN2UiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJsb2NhdGlvbiIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo0MjAwIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIiwiZGVmYXVsdC1yb2xlcy1jb21wYXJhdGV1ciJdfSwicmVzb3VyY2VfYWNjZXNzIjp7InJlYWxtLW1hbmFnZW1lbnQiOnsicm9sZXMiOlsibWFuYWdlLWV2ZW50cyIsIm1hbmFnZS1yZWFsbSIsIm1hbmFnZS1pZGVudGl0eS1wcm92aWRlcnMiLCJpbXBlcnNvbmF0aW9uIiwiY3JlYXRlLWNsaWVudCIsIm1hbmFnZS11c2VycyIsIm1hbmFnZS1hdXRob3JpemF0aW9uIiwicXVlcnktY2xpZW50cyIsIm1hbmFnZS1jbGllbnRzIiwicXVlcnktZ3JvdXBzIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6ImVtYWlsIHByb2ZpbGUiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImNsaWVudEhvc3QiOiIxOTIuMTY4LjEwMC4xMTciLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJzZXJ2aWNlLWFjY291bnQtbG9jYXRpb24iLCJjbGllbnRBZGRyZXNzIjoiMTkyLjE2OC4xMDAuMTE3IiwiY2xpZW50X2lkIjoibG9jYXRpb24ifQ.v8wQWlUy3vyaKP4XV6ZCT_eGE1gGGIf26Bk1iVO_U7MG_TdwYr8IWds7AxzZBTyv7wLJa-u2p7fJKZVjpc9rBC_FiA-EM1IYMkCcRunjMMBZvYKyCP6ylVRUFN7wr6Qn6LtfrW3fYssm3XatnXKu1FEEtC8uL9c9ld7HBzPDCNy7Qiwry35BGRiueORxIxdJ9gVYaXQfCr1sjEQYIgDKz5ht3LkKxwiEqGmhlJpVEDaGmyvxVTsvB6Sn40_7DRweh_ZNgbrHxu1zd816EXh0X-WSnn4_aXHQxRL-wOYL28eyFMcyouiVuaVU-K90KxsJmIE52gM7rQk-6Z2--S22zQ';

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
    body.set('scope', 'openid offline_access'); // ✅ Ensures refresh tokens

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



  // 2️⃣ **REGISTER (Create User in Keycloak)**
register(user: Partial<User>): Observable<any> {
  const url = `${this.keycloakUrl}/admin/realms/${this.realm}/users`;

  const keycloakUser = {
    username: user.username ?? '',
    email: user.email ?? '',
    firstName: user.username ?? '',
    enabled: true,
    credentials: [{ type: 'password', value: user.password ?? '', temporary: false }],
    attributes: {
      phone: user.phone ? [user.phone.toString()] : [],
      photo: user.photo ? [user.photo] : [],
      workplace: user.workplace ? [user.workplace] : [],
    },
  };

  return this.http.post(url, keycloakUser, {
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
