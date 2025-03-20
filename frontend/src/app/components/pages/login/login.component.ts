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
  showRobotError = false;
  showConditions = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private userloginService: UserloginService // Fixed casing and type annotation
  ) {}



  closeConditions() {
    this.showConditions = false;
  }

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
        next: (response) => {
          console.log('Login response:', response); // Log response
          this.storeUserDetails(response.token);
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
          this.storeUserDetails(response.token);
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
    if (!token) {
      console.error('No token provided');
      return;
    }

    try {
      const payload = token.split('.')[1];
      const decodedToken = JSON.parse(atob(payload));
      console.log('Decoded token:', decodedToken); // Log decoded token

      const userDetails = {
        username: decodedToken.preferred_username,
        email: decodedToken.email,
        firstName: decodedToken.given_name,
        lastName: decodedToken.family_name,
        workplace: decodedToken.workplace,
        phoneNumber: decodedToken.phone_number,
      };
      console.log('User details:', userDetails); // Log user details
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
