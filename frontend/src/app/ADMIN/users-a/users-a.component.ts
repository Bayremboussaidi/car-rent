import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './users-a.component.html',
  styleUrls: ['./users-a.component.css']
})
export class UserListComponent implements OnInit {
  users: any[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.userService.getAllUsers().subscribe(
      (data:any) => {
        this.users = data;
      },
      (error:any) => {
        console.error('Error fetching users', error);
      }
    );
  }

  openAddModal(): void {
    // Implement modal logic here
    console.log('Open Add User Modal');
  }


  deleteUser(userId: number, index: number): void {
    if (!userId) {
      console.error('Error: Trying to delete a user with an undefined ID.');
      return;
    }

    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe(() => {
        this.users.splice(index, 1); // Remove the deleted user from the list
        console.log(`User with ID ${userId} deleted.`);
      }, (error:any) => {
        console.error('Error deleting user:', error);
      });
    }
  }
}
