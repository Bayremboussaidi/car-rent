import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  errorMessage: string = '';

  private keycloakBaseUrl = 'https://192.168.100.248:8443';
  private realm = 'comparateur';
  private clientId = 'location';
  private redirectUri = 'http://localhost:4200/login'; // ✅ Ensure this is set in Keycloak client settings
  private tokenEndpoint = `${this.keycloakBaseUrl}/realms/${this.realm}/protocol/openid-connect/token`;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.handleKeycloakResponse();
  }

  async redirectToKeycloak(): Promise<void> {
    const codeVerifier = this.generateCodeVerifier();
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);

    // Store PKCE Code Verifier
    sessionStorage.setItem('pkce_verifier', codeVerifier);

    // Get the CSP nonce dynamically (ensure it's generated in index.html)
    const nonce = (window as any).globalNonce || '';

    const keycloakLoginUrl = `${this.keycloakBaseUrl}/realms/${this.realm}/protocol/openid-connect/auth`
      + `?client_id=${encodeURIComponent(this.clientId)}`
      + `&response_type=code`
      + `&scope=openid`
      + `&redirect_uri=${encodeURIComponent(this.redirectUri)}`
      + `&code_challenge=${codeChallenge}`
      + `&code_challenge_method=S256`
      + `&nonce=${nonce}`; // ✅ Ensures CSP compliance

    console.log("🔀 Redirecting to:", keycloakLoginUrl);
    window.location.href = keycloakLoginUrl;
  }

  async handleKeycloakResponse(): Promise<void> {
    this.route.queryParams.subscribe(async params => {
      const code = params['code'];
      if (code) {
        console.log("✅ Received authorization code:", code);
        await this.exchangeCodeForToken(code);
      } else {
        console.warn("⚠️ No authorization code found. Redirecting to Keycloak...");
        this.redirectToKeycloak();
      }
    });
  }

  async exchangeCodeForToken(code: string): Promise<void> {
    const codeVerifier = sessionStorage.getItem('pkce_verifier') || '';
    if (!codeVerifier) {
      console.error("❌ PKCE Code Verifier not found in sessionStorage!");
      alert("❌ Authentication failed. Please try logging in again.");
      this.redirectToKeycloak();
      return;
    }

    const body = new HttpParams()
      .set('grant_type', 'authorization_code')
      .set('client_id', this.clientId)
      .set('redirect_uri', this.redirectUri)
      .set('code', code)
      .set('code_verifier', codeVerifier); // ✅ Fixed PKCE verifier

    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };

    try {
      const response: any = await this.http.post(this.tokenEndpoint, body, { headers }).toPromise();

      console.log("✅ Token received:", response);
      sessionStorage.setItem('access_token', response.access_token);
      this.router.navigate(['/home']);
    } catch (error) {
      console.error("❌ Token exchange failed", error);
      alert("❌ Authentication failed. Please try logging in again.");
      this.redirectToKeycloak();
    }
  }

  // Generate a secure PKCE Code Verifier
  generateCodeVerifier(): string {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  // Generate the PKCE Code Challenge from the Verifier
  async generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
}
