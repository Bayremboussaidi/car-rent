// register.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service'; // Ensure the path is correct
import { User } from '../../../models/user.model'; // Ensure correct import path

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  credentials: Partial<User> = {
    username: '',
    phone: undefined,
    email: '',
    password: '',
    workplace: '',
    photo: '',
    anonymous: false, // Ensure this is always explicitly set
  };

  constructor(private authService: AuthService, private router: Router) {}

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

  async handleClick(event: Event) {
    event.preventDefault();

    try {
      const credentials: User = {
        id: undefined, // Keycloak generates ID
        username: this.credentials.username ?? '',
        phone: this.credentials.phone ? Number(this.credentials.phone) : undefined,
        email: this.credentials.email ?? '',
        password: this.credentials.password ?? '',
        photo: this.credentials.photo ?? '',
        workplace: this.credentials.workplace ?? null,
        role: this.credentials.role ?? 'USER', // Default role
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        anonymous: false, // Explicitly set
        bearer: '', // No token during registration
      };

      const response = await this.authService.register(credentials).toPromise();

      if (response && response.status === 201) { // Check if registration was successful
        console.log("✅ User registered successfully:", response);
        alert("🎉 Registration successful! You can now log in.");
        this.router.navigate(['/login']); // Redirect to login page
      } else {
        console.warn("⚠️ Unexpected response:", response);
      }
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
