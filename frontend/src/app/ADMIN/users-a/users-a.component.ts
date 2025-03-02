import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-users',
  templateUrl: './users-a.component.html',
  styleUrls: ['./users-a.component.css']
})
export class UserAComponent implements OnInit {
  users: User[] = [];
  selectedUsers: User[] = [];
  isAddModalOpen = false;
  isEditMode = false;
  userToEdit: User | null = null;

  newUser: User = this.getEmptyUser();

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getUsers();
  }

  // ✅ Fetch all users
  getUsers(): void {
    this.userService.getAllUsers().subscribe(
      (response: any) => {
        if (response.success && Array.isArray(response.data)) {
          this.users = response.data;
        }
      },
      (error: any) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  // ✅ Delete a user
  deleteUser(userId: number, index: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe(
        (response: any) => {
          console.log('User deleted successfully:', response);
          this.users.splice(index, 1);
        },
        (error: any) => {
          console.error('Error deleting user:', error);
        }
      );
    }
  }

  // ✅ Check if a user is selected
  isSelected(user: User): boolean {
    return this.selectedUsers.some((selectedUser) => selectedUser.id === user.id);
  }

  // ✅ Toggle user selection
  toggleSelection(user: User): void {
    this.isSelected(user)
      ? (this.selectedUsers = this.selectedUsers.filter((selectedUser) => selectedUser.id !== user.id))
      : this.selectedUsers.push(user);
  }

  // ✅ Select or Deselect all users
  toggleSelectAll(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.selectedUsers = isChecked ? [...this.users] : [];
  }

  // ✅ Update multiple selected users (Fixed `user.id` issue)
  updateSelectedUsers(): void {
    this.selectedUsers.forEach((user) => {
      if (user.id !== undefined) {  // Ensure `id` is defined
        this.userService.updateUser(user.id, user).subscribe(
          (response: any) => {
            console.log('User updated successfully:', response);
            this.getUsers();
          },
          (error: any) => {
            console.error('Error updating user:', error);
          }
        );
      } else {
        console.error('Error: Cannot update user with undefined ID.');
      }
    });
  }

  // ✅ Open modal for adding a new user
  openAddModal(): void {
    this.isAddModalOpen = true;
    this.isEditMode = false;
    this.newUser = this.getEmptyUser();
  }

  // ✅ Open modal for editing an existing user
  openEditModal(user: User): void {
    this.isAddModalOpen = true;
    this.isEditMode = true;
    this.userToEdit = { ...user };
  }

  // ✅ Close modal and reset form
  closeAddModal(): void {
    this.isAddModalOpen = false;
    this.isEditMode = false;
    this.userToEdit = null;
    this.newUser = this.getEmptyUser();
  }

  // ✅ Handle add user submission (Fixed `userToEdit.id` issue)
  onAddUserSubmit(): void {
    if (this.isEditMode && this.userToEdit) {
      if (this.userToEdit.id !== undefined) { // Ensure `id` is defined
        this.userService.updateUser(this.userToEdit.id, this.userToEdit).subscribe(
          (response: any) => {
            console.log('User updated successfully:', response);
            this.getUsers();
            this.closeAddModal();
          },
          (error: any) => {
            console.error('Error updating user:', error);
          }
        );
      } else {
        console.error('Error: Cannot update user with undefined ID.');
      }
    } else {
      this.userService.createUser(this.newUser).subscribe(
        (response: any) => {
          console.log('User added successfully:', response);
          this.getUsers();
          this.closeAddModal();
        },
        (error: any) => {
          console.error('Error adding user:', error);
        }
      );
    }
  }

  // ✅ Utility function to return an empty user object (Fixed `anonymous` issue)
  private getEmptyUser(): User {
    return {
      id: 0, // Set to 0 (or remove if ID is auto-generated)
      username: '',
      email: '',
      password: '',
      role: 'USER',
      phone: undefined,
      workplace: undefined,
      photo: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      anonymous: false, // ✅ Ensured `anonymous` is always defined
    };
  }
}
