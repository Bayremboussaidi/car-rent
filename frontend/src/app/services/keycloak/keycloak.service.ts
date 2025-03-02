import { Injectable } from "@angular/core";
import Keycloak from "keycloak-js";
import { User } from "../../models/user.model";

interface KeycloakUserInfo {
  email?: string;
  preferred_username?: string;
}

@Injectable({ providedIn: "root" })
export class KeycloakService {
  private _keycloak: Keycloak | undefined;
  user: User | undefined;

  get keycloak() {
    if (!this._keycloak) {
      this._keycloak = new Keycloak({
        url: "http://192.168.100.248:8080",
        realm: "comparateur",
        clientId: "bsn",
      });
    }
    return this._keycloak;
  }

  async init(): Promise<boolean> {
    const authenticated = await this.keycloak.init({
      onLoad: "check-sso",
      silentCheckSsoRedirectUri: window.location.origin + "/assets/silent-check-sso.html",
    });

    if (!authenticated) {
      return false;
    }

    try {
      const userInfo = await this.keycloak.loadUserInfo() as KeycloakUserInfo;

      this.user = {
        id: undefined, // Keycloak does not provide an explicit user ID
        username: userInfo.preferred_username || undefined,
        email: userInfo.email || undefined,
        role: this.extractRoleFromToken(),
        anonymous: false,
        bearer: this.keycloak.token || "",
      };
    } catch (error) {
      console.error("Error loading user info:", error);
      return false;
    }

    return true;
  }

  private extractRoleFromToken(): "ADMIN" | "USER" | "AGENCE" | undefined {
    if (!this.keycloak.token) return undefined;

    try {
      const decodedToken = JSON.parse(atob(this.keycloak.token.split(".")[1]));
      return decodedToken.realm_access?.roles?.find((role: string) =>
        ["ADMIN", "USER", "AGENCE"].includes(role)
      );
    } catch (error) {
      console.error("Error decoding token:", error);
      return undefined;
    }
  }

  login(): void {
    this.keycloak.login();
  }

  logout(): void {
    this.keycloak.logout({ redirectUri: window.location.origin });
  }

  getToken(): Promise<string> {
    return this.keycloak.token ? Promise.resolve(this.keycloak.token) : Promise.reject("No token available");
  }
}
