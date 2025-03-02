import { Injectable, computed, inject, signal } from "@angular/core";
import { isPlatformServer } from "@angular/common";
import { PLATFORM_ID } from "@angular/core";
import { KeycloakService } from "./keycloak.service";
import { User } from "../../models/user.model";

// Anonymous User Object
const ANONYMOUS_USER: User = {
  id: undefined,
  username: "Guest",
  email: "",
  role: undefined,
  phone: undefined,
  workplace: null,
  createdAt: undefined,
  updatedAt: undefined,
  anonymous: true,
  bearer: "",
};

@Injectable({ providedIn: "root" })
export class SecurityStore {
  #keycloakService = inject(KeycloakService);

  loaded = signal(false);
  user = signal<User | undefined>(undefined);

  loadedUser = computed(() => (this.loaded() ? this.user() : undefined));
  signedIn = computed(() => this.loaded() && !this.user()?.anonymous);

  constructor() {
    this.onInit();
  }

  async onInit() {
    const isServer = isPlatformServer(inject(PLATFORM_ID));

    if (isServer) {
      this.user.set(ANONYMOUS_USER);
      this.loaded.set(true);
      return;
    }

    const isLoggedIn = await this.#keycloakService.init();

    if (isLoggedIn && this.#keycloakService.user) {
      this.user.set(this.#keycloakService.user);
    } else {
      this.user.set(ANONYMOUS_USER);
    }

    this.loaded.set(true);
  }

  async signIn() {
    await this.#keycloakService.login();
    await this.onInit(); // Refresh user state after login
  }

  async signOut() {
    await this.#keycloakService.logout();
    this.user.set(ANONYMOUS_USER);
    this.loaded.set(true);
  }
}
