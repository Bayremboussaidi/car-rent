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
      this.authService.logout(); // Clear any potential invalid state

      this.userloginService.login(this.credentials).subscribe({
        next: (response) => {
          console.log('Login response:', response); // Log response
          this.userloginService.storeUserDetails(response.token);
          this.router.navigate(['/home']);
        },
        error: (err: any) => {
          this.errorMessage = err || 'Email ou mot de passe incorrect'; // French error
        }
      });


      //login l admin mazelet
    } else {
      this.authService.login(this.credentials).subscribe({
        next: (response) => {
          console.log('Login successful');
          //this.userloginService.storeUserDetails(response.token);
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('Login failed', err);
          this.errorMessage = 'Email ou mot de passe incorrect';
        },
      });
    }
  }


  private validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
}
