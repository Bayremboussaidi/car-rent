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
  isUser = false;
  showRobotError = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private userloginService: UserloginService // Fixed casing and type annotation
  ) {}

  handleClick(event: Event) {
    event.preventDefault();
    this.errorMessage = ''; // Reset error message
    this.showRobotError = false; // Reset robot error

    if (!this.isRobot) {
      this.showRobotError = true;
      return;
    }

    if (!this.validateEmail(this.credentials.email)) {
      this.errorMessage = 'Veuillez entrer une adresse email valide'; // Consistent French error
      return;
    }

    if (this.isUser) {
      this.userloginService.login(this.credentials).subscribe({
        next: (response) => { // Added next handler for user login
          this.storeUserDetails(response.access_token);
          this.router.navigate(['/home']);
        },
        error: (err: any) => {
          this.errorMessage = err || 'Email ou mot de passe incorrect'; // French error
        }
      });
    } else {
      this.authService.login(this.credentials).subscribe({
        next: (response) => {
          console.log('Login successful');
          this.storeUserDetails(response.access_token);
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('Login failed', err);
          this.errorMessage = 'Email ou mot de passe incorrect';
        },
      });
    }
  }

  private storeUserDetails(token: string) {
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const userDetails = {
        username: decodedToken.preferred_username,
        email: decodedToken.email,
        firstName: decodedToken.given_name,
        lastName: decodedToken.family_name,
        workplace: decodedToken.workplace,
        phoneNumber: decodedToken.phone_number,
      };
      localStorage.setItem('user', JSON.stringify(userDetails));
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }

  private validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
}
