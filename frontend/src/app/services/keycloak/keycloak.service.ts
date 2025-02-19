import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';

@Injectable({
  providedIn: 'root',
})
export class KeycloakService {
  keycloak: Keycloak; // Rename keycloakAuth to keycloak

  constructor() {
    this.keycloak = new Keycloak({
      url: 'http://192.168.100.228:9090',
      realm: 'comparateur',
      clientId: 'bsn',
    });
  }

  async init(): Promise<void> {
    try {
      await this.keycloak.init({
        onLoad: 'login-required',
        checkLoginIframe: false,
      });
      console.log('Keycloak initialized successfully');
    } catch (error) {
      console.error('Keycloak initialization failed', error);
    }
  }

  isAuthenticated(): boolean {
    return !!this.keycloak.authenticated;
  }

  login(): void {
    this.keycloak.login();
  }

  logout(): void {
    this.keycloak.logout();
  }

  getToken(): Promise<string> {
    return this.keycloak.token ? Promise.resolve(this.keycloak.token) : Promise.reject('No token available');
  }
}
