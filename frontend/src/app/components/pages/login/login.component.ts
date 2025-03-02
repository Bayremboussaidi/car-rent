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

  constructor(private authService: AuthService, private router: Router) {}

  async handleClick(event: Event) {
    event.preventDefault();

    this.authService.login(this.credentials).subscribe({
      next: () => {
        console.log('Login successful');
        this.router.navigate(['/home']); // Redirect to dashboard after login
      },
      error: (err) => {
        console.error('Login failed', err);
        this.errorMessage = 'Email ou mot de passe incorrect';
      },
    });
  }
}
