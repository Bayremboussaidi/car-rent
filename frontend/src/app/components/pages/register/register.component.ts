import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service'; // Handles Keycloak Registration
import { UserService } from '../../../services/user.service'; // Handles MySQL Storage
import { User } from '../../../models/user.model'; // Ensure correct import path

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  credentials: Partial<User> = {
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: undefined,
    workplace: '',
    photo: '',
    role: 'USER', // Default role
    anonymous: false, // Ensure this is always explicitly set
  };

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  // ✅ Handle input changes dynamically
  handleChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const key = target.id as keyof Partial<User>;

    if (key === 'phone') {
      this.credentials.phone = target.value ? Number(target.value) : undefined;
    } else if (key === 'role') {
      this.credentials.role = target.value as 'ADMIN' | 'USER' | 'AGENCE';
    } else if (key === 'anonymous') {
      this.credentials.anonymous = target.value === 'true';
    } else if (key === 'workplace') {
      this.credentials.workplace = target.value ? target.value : null;
    } else {
      this.credentials[key] = target.value as any; // Safe fallback
    }
  }

  // ✅ Handle user registration
  async handleClick(event: Event) {
    event.preventDefault();

    try {
      const userData: User = {
        id: undefined, // Keycloak generates ID
        username: this.credentials.username ?? '',
        firstName: this.credentials.firstName ?? '',
        lastName: this.credentials.lastName ?? '',
        email: this.credentials.email ?? '',
        password: this.credentials.password ?? '',
        phone: this.credentials.phone ? Number(this.credentials.phone) : undefined,
        workplace: this.credentials.workplace ?? null,
        photo: this.credentials.photo ?? '',
        role: 'USER', // Default role in MySQL
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        anonymous: false, // Explicitly set
        bearer: '', // No token during registration
      };

      console.log("🚀 Registering user in Keycloak:", userData);

      // ✅ 1. Register User in Keycloak
      await this.authService.register(userData).toPromise();

      console.log("✅ User registered in Keycloak. Now storing details in MySQL...");

      // ✅ 2. Store User Details in MySQL
      await this.userService.createUser(userData).toPromise();

      console.log("✅ User details stored in MySQL.");
      alert("🎉 Registration successful! You can now log in.");
      this.router.navigate(['/login']); // Redirect to login page

    } catch (error: any) { // ✅ Explicitly cast error as 'any'
      console.error("❌ Registration failed:", error);

      if (error.status === 409) {
        alert("⚠️ User already exists! Try logging in instead.");
      } else {
        alert("❌ Registration failed. Please try again.");
      }
    }
  }
}
