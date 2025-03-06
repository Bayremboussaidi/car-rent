import { Injectable } from "@angular/core";
import Keycloak from "keycloak-js";
import { User } from "../../models/user.model";

interface KeycloakUserInfo {
  email?: string;
  preferred_username?: string;
}

@Injectable({ providedIn: "root" })
export class KeycloakService {
  private _keycloak = new Keycloak({
    url: "http://192.168.100.248:8443",
    realm: "comparateur",
    clientId: "location",
  });

  user: User | undefined;

  async init(): Promise<boolean> {
    try {
      const authenticated = await this._keycloak.init({
        onLoad: "check-sso",
        silentCheckSsoRedirectUri: window.location.origin + "/assets/silent-check-sso.html",
      });

      if (!authenticated) return false;

      const userInfo = (await this._keycloak.loadUserInfo()) as KeycloakUserInfo;

      this.user = {
        id: undefined, // Keycloak does not provide an explicit user ID
        username: userInfo.preferred_username || undefined,
        email: userInfo.email || undefined,
        role: this.extractRoleFromToken(),
        anonymous: false,
        bearer: this._keycloak.token || "",
      };

      return true;
    } catch (error) {
      console.error("Error initializing Keycloak:", error);
      return false;
    }
  }

  private extractRoleFromToken(): "ADMIN" | "USER" | "AGENCE" | undefined {
    if (!this._keycloak.token) return undefined;

    try {
      const decodedToken = JSON.parse(atob(this._keycloak.token.split(".")[1]));
      return decodedToken?.realm_access?.roles?.find((role: string) =>
        ["ADMIN", "USER", "AGENCE"].includes(role)
      );
    } catch (error) {
      console.error("Error decoding token:", error);
      return undefined;
    }
  }

  login(): void {
    this._keycloak.login();
  }

  logout(): void {
    this._keycloak.logout({ redirectUri: window.location.origin });
  }

  async getToken(): Promise<string> {
    try {
      if (this._keycloak.isTokenExpired()) {
        console.log("Refreshing token...");
        await this._keycloak.updateToken(30);
      }
      return this._keycloak.token || "";
    } catch (error) {
      console.error("Error refreshing token:", error);
      return Promise.reject("No token available");
    }
  }
}
