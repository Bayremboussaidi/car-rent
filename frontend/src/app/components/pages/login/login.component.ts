import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserloginService } from '../../../services/user_login/userlogin.service';
import { AgenceService } from '../../../services/agence/agence.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = { email: '', password: '' };
  errorMessage: string = '';
  isRobot = false;
  isUser = false;       // changed to false to allow neutral state
  isAgence = false;     // changed to false to allow neutral state
  showRobotError = false;
  showConditions = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private userloginService: UserloginService,
    private agenceService: AgenceService
  ) {}

  closeConditions() {
    this.showConditions = false;
  }

  handleClick(event: Event) {
    event.preventDefault();
    this.errorMessage = '';
    this.showRobotError = false;

    if (!this.isRobot) {
      this.showRobotError = true;
      return;
    }

    if (!this.validateEmail(this.credentials.email)) {
      this.errorMessage = 'Veuillez entrer une adresse email valide';
      return;
    }

    // Login flow depending on role selection
    if (this.isUser) {
      this.handleUserLogin();
    } else if (this.isAgence) {
      this.handleAgencyLogin();
    } else {
      this.handleKeycloakLogin(); // fallback if both are unchecked
    }
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private handleUserLogin() {
    this.authService.logout();
    this.userloginService.login(this.credentials).subscribe({
      next: (response) => {
        this.userloginService.storeUserDetails(response.token);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.errorMessage = err?.message || 'Email ou mot de passe incorrect';
      }
    });
  }

  private handleAgencyLogin() {
    this.authService.logout();
    this.agenceService.login(this.credentials).subscribe({
      next: (response: any) => {
        const agencyData = {
          token: response.token,
          agencyId: response.id,
          name: response.agencyName
        };

        localStorage.setItem('agency_auth', JSON.stringify(agencyData));

        this.router.navigate(['/agence']);
      },
      error: (err: any) => {
        this.errorMessage = err?.message || 'Email ou mot de passe incorrect pour agence';
      }
    });
  }

  private handleKeycloakLogin() {
    this.authService.logout();

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('refresh_token', response.refresh_token);
        localStorage.setItem('role', response.role);

        const userDetails = this.authService.decodeToken(response.access_token);
        localStorage.setItem('user', JSON.stringify(userDetails));

        this.router.navigate(['/admin']);
      },
      error: (err) => {
        this.errorMessage = err?.error?.error_description || 'Email ou mot de passe incorrect';
      }
    });
  }
}

   // Keycloak login

   /*private async handleKeycloakLogin() {
    try {
      this.authService.logout(); // Clear any existing tokens

      // Init Keycloak first
      const initialized = await this.keycloakService.init();
      if (!initialized) {
        // If not authenticated, start login process
        this.keycloakService.login();
        return;
      }

      // If we get here, user is already authenticated
      const token = await this.keycloakService.getToken();
      const userDetails = this.keycloakService.currentUser;

      if (userDetails) {
        localStorage.setItem('access_token', token);
        localStorage.setItem('role', userDetails.role || 'USER');
        localStorage.setItem('user', JSON.stringify(userDetails));

        // Redirect based on role
        if (userDetails.role === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/user']);
        }
      } else {
        this.errorMessage = 'Failed to load user details';
      }
    } catch (error) {
      this.errorMessage = `Keycloak login error: ${error}`;
    }
  }

  private validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  toggleCheck(type: 'user' | 'agence') {
    this.isUser = type === 'user';
    this.isAgence = type === 'agence';
  }
}
*/
