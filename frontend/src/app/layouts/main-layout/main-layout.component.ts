import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service'; // Adjust the path

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
})
export class MainLayoutComponent implements OnInit {
  isAdmin: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.isAdmin = this.authService.getRole() === 'ADMIN';
  }
}
