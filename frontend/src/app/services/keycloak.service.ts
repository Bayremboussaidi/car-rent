import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';

@Injectable({
  providedIn: 'root',
})
export class KeycloakService {
  private keycloakAuth: Keycloak;

  constructor() {
    this.keycloakAuth = new Keycloak({
      url: 'http://localhost:9090', // Replace with your Keycloak URL
      realm: 'comparateur',
      clientId: '1b646eea-1593-46bb-b797-89f9595c5478',
    });
  }

  async init(): Promise<void> {
    try {
      await this.keycloakAuth.init({
        onLoad: 'login-required',
        checkLoginIframe: false,
      });
      console.log('Keycloak initialized successfully');
    } catch (error) {
      console.error('Keycloak initialization failed', error);
    }
  }

  isAuthenticated(): boolean {
    return !!this.keycloakAuth.authenticated;
  }

  login(): void {
    this.keycloakAuth.login();
  }

  logout(): void {
    this.keycloakAuth.logout();
  }

  getToken(): Promise<string> {
    return this.keycloakAuth.token ? Promise.resolve(this.keycloakAuth.token) : Promise.reject('No token available');
  }
}
