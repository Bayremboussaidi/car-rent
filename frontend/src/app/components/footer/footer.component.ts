import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();

  quickLinks = [
    { path: '/home', display: 'Accueil' },
    { path: '/about', display: 'À Propos' },
    { path: '/services', display: 'Services' },
    { path: '/contact', display: 'Contact' },
    { path: '/faq', display: 'FAQ' }
  ];
}
