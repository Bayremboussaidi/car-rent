import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  userData: User = {
    role: 'USER' // Set default role to 'USER'
  };

  constructor(private userService: UserService, private router: Router) {}

  handleChange(event: any) {
    const { id, value } = event.target;
    this.userData[id as keyof User] = value;
  }

  handleClick(event: Event) {
    event.preventDefault();
    this.userService.createUser(this.userData).subscribe(
      (response: User) => {
        console.log('User created successfully', response);
        this.router.navigate(['/login']);
      },
      (error: any) => {
        console.error('Error creating user', error);
      }
    );
  }
}
