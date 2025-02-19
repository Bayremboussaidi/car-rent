import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from '../../../services/keycloak/keycloak.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private keycloakService: KeycloakService, private router: Router) {}

  async ngOnInit(): Promise<void> {
    await this.keycloakService.init(); // Initialize Keycloak (does not auto-login)
  }

  async handleClick(event: Event) {
    event.preventDefault();
    try {
      await this.keycloakService.login(); // Redirects to Keycloak login page
    } catch (error) {
      console.error('An error occurred during login:', error);
    }
  }
}
