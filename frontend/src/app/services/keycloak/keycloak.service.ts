import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';

@Injectable({
  providedIn: 'root',
})
export class KeycloakService {
  private keycloakAuth: Keycloak;

  constructor() {
    this.keycloakAuth = new Keycloak({
      url: 'http://192.168.100.228:9090',
      realm: 'comparateur',
      clientId: 'bsn',
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



/*
import {Injectable} from '@angular/core';
import Keycloak from 'keycloak-js';
import {UserProfile} from './user-profile';

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {
  private _keycloak: Keycloak | undefined;

  get keycloak() {
    if (!this._keycloak) {
      this._keycloak = new Keycloak({
        url: 'http://localhost:9090',
        realm: 'book-social-network',
        clientId: 'bsn'
      });
    }
    return this._keycloak;
  }

  private _profile: UserProfile | undefined;

  get profile(): UserProfile | undefined {
    return this._profile;
  }

  async init() {
    const authenticated = await this.keycloak.init({
      onLoad: 'login-required',
    });

    if (authenticated) {
      this._profile = (await this.keycloak.loadUserProfile()) as UserProfile;
      this._profile.token = this.keycloak.token || '';
    }
  }

  login() {
    return this.keycloak.login();
  }

  logout() {
    // this.keycloak.accountManagement();
    return this.keycloak.logout({redirectUri: 'http://localhost:4200'});
  }
}*/
