// footer.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  quickLinks = [
    { path: '/about', display: 'À propos' },
    { path: '#', display: 'Politique de confidentialité' },
    { path: '/cars', display: 'Voitures' },
    { path: '/blogs', display: 'Blogs' },
    { path: '/contact', display: 'Contact' }
  ];

  currentYear: number = new Date().getFullYear();
}