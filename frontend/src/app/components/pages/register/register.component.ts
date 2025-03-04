import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {
    this.redirectToKeycloak();
  }

  async redirectToKeycloak(): Promise<void> {
    // Keycloak configuration
    const keycloakBaseUrl = 'https://192.168.100.248:8443'; // Use HTTPS Keycloak URL
    const realm = 'comparateur'; // Keycloak realm
    const clientId = 'location'; // Keycloak Client ID
    const redirectUri = 'http://localhost:4200/login/'; // Ensure this matches Keycloak settings!

    // Generate PKCE Code Verifier & Code Challenge
    const codeVerifier = this.generateCodeVerifier();
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);

    // Store PKCE Verifier for later token exchange
    sessionStorage.setItem('pkce_verifier', codeVerifier);

    // Construct Keycloak registration URL with PKCE support
    const keycloakRegisterUrl = `${keycloakBaseUrl}/realms/${realm}/protocol/openid-connect/auth`
      + `?client_id=${encodeURIComponent(clientId)}`
      + `&response_type=code`
      + `&scope=openid`
      + `&redirect_uri=${encodeURIComponent(redirectUri)}`
      + `&kc_action=register`
      + `&code_challenge=${codeChallenge}`
      + `&code_challenge_method=S256`;

    // Debugging: Check the URL before redirecting
    console.log("🔀 Redirecting to:", keycloakRegisterUrl);

    // Redirect user to Keycloak registration page
    window.location.href = keycloakRegisterUrl;
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
