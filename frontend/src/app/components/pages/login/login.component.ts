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
  credentials = { username: '', password: '' };
  errorMessage: string = '';
  isRobot = false;
  isUser = false;
  isAgence = false;
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

    if (!this.credentials.username) {
      this.errorMessage = 'Veuillez entrer un nom d\'utilisateur';
      return;
    }

    if (!this.credentials.password) {
      this.errorMessage = 'Veuillez entrer un mot de passe';
      return;
    }

    if (this.isUser) {
      this.handleUserLogin();
    } else if (this.isAgence) {
      this.handleAgencyLogin();
    } else {
      this.handleKeycloakLogin();
    }
  }
  private handleUserLogin() {}
  /*

  private handleUserLogin() {
    this.authService.logout();
    this.userloginService.login(this.credentials).subscribe({
      next: (response) => {
        this.userloginService.storeUserDetails(response.token);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.errorMessage = err?.message || 'Nom d\'utilisateur ou mot de passe incorrect';
      }
    });
  }
*/
/*
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
        this.errorMessage = err?.message || 'Nom d\'utilisateur ou mot de passe incorrect pour agence';
      }
    });
  }*/
    private handleAgencyLogin() {}

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
        this.errorMessage = err?.error?.error_description || 'Nom d\'utilisateur ou mot de passe incorrect';
      }
    });
  }

  toggleCheck(type: 'user' | 'agence') {
    this.isUser = type === 'user';
    this.isAgence = type === 'agence';
  }
}
