import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../../../services/auth.service'; // Adjust path as necessary

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = { email: '', password: '' };

  constructor(private authService: AuthService, private router: Router) {}

  async handleClick(event: Event) {
    event.preventDefault(); // Prevent default form submission

    try {
      // Call the login method from AuthService and await its result
      const result = await this.authService.login(this.credentials).toPromise();

      // Ensure the role is properly set before navigating
      if (result) {
        setTimeout(() => {  // Small delay to ensure localStorage update
          const role = this.authService.getRole();
          if (role === 'ADMIN') {
            this.router.navigate(['/admin/dashboard']);
          } else if (role === 'USER') {
            this.router.navigate(['/home']);
          } else {
            console.error('Unexpected role received:', role);
          }
        }, 50); // Adding a 50ms delay to allow localStorage update
      } else {
        console.error('Login failed: Invalid credentials');
      }
    } catch (error) {
      console.error('An error occurred during login:', error);
    }
  }
}
