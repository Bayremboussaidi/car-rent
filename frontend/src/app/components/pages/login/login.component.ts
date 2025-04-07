import { AgenceService } from './../../../services/agence/agence.service'; // Corrected path
import { UserloginService } from './../../../services/user_login/userlogin.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  credentials = { email: '', password: '' };
  errorMessage: string = '';
  isRobot = false;
  isUser = true;
  isAgence = false;
  showRobotError = false;
  showConditions = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private userloginService: UserloginService,
    private agenceService: AgenceService // Corrected variable name casing
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

    if (this.isUser) {
      this.handleUserLogin();
    } else if (this.isAgence) {
      this.handleAgencyLogin();
    }
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
      next: (response) => {
        // Store agency auth data
        const agencyData = {
          token: response.token,
          agencyId: response.id,
          name: response.agencyName
        };

        localStorage.setItem('agency_auth', JSON.stringify(agencyData));

        // Log the stored data
        console.log('LocalStorage after agency login:');
        console.log('agency_auth:', JSON.parse(localStorage.getItem('agency_auth') || 'No agency data'));
        console.log('All localStorage:', localStorage);

        this.router.navigate(['/agence']);
      },
      error: (err) => {
        this.errorMessage = err?.message || 'Email ou mot de passe incorrect pour agence';
      }
    });
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
