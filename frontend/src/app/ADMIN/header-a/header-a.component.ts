import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-header-a',
  templateUrl: './header-a.component.html',
  styleUrl: './header-a.component.css'
})
export class HeaderAComponent {
  isDropdownVisible: boolean =false;

  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  // Close dropdown when clicking outside of it
  @HostListener('document:click', ['$event'])
  closeDropdown(event: MouseEvent) {
    const dropdown = document.querySelector('.dropdown');
    const button = event.target as HTMLElement;

    // Close the dropdown if clicked outside the button or dropdown
    if (dropdown && !dropdown.contains(button)) {
      this.isDropdownVisible = false;
    }
  }
}
