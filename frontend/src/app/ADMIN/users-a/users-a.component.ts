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

  // ✅ Fetch all users (Fixed response handling)
  getUsers(): void {
    this.userService.getAllUsers().subscribe(
      (response: User[]) => {
        if (Array.isArray(response)) {
          this.users = response.map(user => ({
            ...user,
            id: Number(user.id) // Ensure `id` is always a number
          }));
        }
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  // ✅ Delete a user (Fixed `id` type conversion)
  deleteUser(userId: number | string, index: number): void {
    const id = Number(userId); // Convert `string` ID to `number`
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe(
        () => {
          console.log('User deleted successfully');
          this.users.splice(index, 1);
        },
        (error) => console.error('Error deleting user:', error)
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

  // ✅ Update multiple selected users (Fixed `id` issue)
  updateSelectedUsers(): void {
    this.selectedUsers.forEach((user) => {
      if (user.id !== undefined) {
        const userId = Number(user.id); // Convert `string` ID to `number`
        this.userService.updateUser(userId, user).subscribe(
          () => {
            console.log('User updated successfully');
            this.getUsers();
          },
          (error) => console.error('Error updating user:', error)
        );
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

  // ✅ Handle add user submission
  onAddUserSubmit(): void {
    if (this.isEditMode && this.userToEdit) {
      if (this.userToEdit.id !== undefined) {
        const userId = Number(this.userToEdit.id); // Convert `string` ID to `number`
        this.userService.updateUser(userId, this.userToEdit).subscribe(
          () => {
            console.log('User updated successfully');
            this.getUsers();
            this.closeAddModal();
          },
          (error) => console.error('Error updating user:', error)
        );
      }
    } else {
      this.userService.createUser(this.newUser).subscribe(
        () => {
          console.log('User added successfully');
          this.getUsers();
          this.closeAddModal();
        },
        (error) => console.error('Error adding user:', error)
      );
    }
  }

  // ✅ Utility function to return an empty user object
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
      anonymous: false,
    };
  }
}
