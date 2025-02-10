// register.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../../../services/auth.service'; // Ensure the path is correct
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  credentials = {
    username: '',
    phone: '',
    email: '',
    password: ''
  };

  constructor(private authService: AuthService, private router: Router) {}

  handleChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const key = target.id as keyof typeof this.credentials; // Type assertion
    this.credentials[key] = target.value;
  }

  async handleClick(event: Event) {
    event.preventDefault();

    try {
      // Convert phone to number before passing to register method
      const credentials = {
        ...this.credentials,
        phone: Number(this.credentials.phone)
      };

      await this.authService.register(credentials).toPromise(); // Call the register method directly
      this.router.navigate(['/login']); // Navigate to login after successful registration
    } catch (err) {
      console.error(err);
    }
  }
}
