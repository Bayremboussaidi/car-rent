import { Component, HostListener } from "@angular/core";
import { KeycloakService } from "../../services/keycloak/keycloak.service";

@Component({
  selector: "app-titan",
  templateUrl: "./titan.component.html",
  styleUrls: ["./titan.component.css"],
})
export class TitanComponent {
  isMenuOpen = false;
  scrollOpacity = 0; // Starts with 0% opacity at the top
  isTopMenuVisible: boolean = true; // Tracks top menu visibility

  constructor(private keycloakService: KeycloakService) {}

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  login(): void {
    this.keycloakService.login();
  }

  logout(): void {
    this.keycloakService.logout();
  }

  @HostListener("window:scroll", [])
  onWindowScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const maxOpacity = 1; // Maximum opacity when scrolling down
    const minOpacity = 0; // Fully transparent at the top
    const scrollFactor = 300; // Distance required for full opacity

    // Calculate opacity based on scroll position
    this.scrollOpacity = Math.min(maxOpacity, scrollTop / scrollFactor);

    // Hide top menu after scrolling 50px, and make app-titan move up
    this.isTopMenuVisible = scrollTop < 50;
  }
}
