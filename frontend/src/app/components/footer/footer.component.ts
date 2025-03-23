import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  email: string = '';

  constructor(private http: HttpClient) {}


  currentYear: number = new Date().getFullYear();




  subscribeToNewsletter() {
    if (this.email) {
      this.http.post('http://localhost:8084/followers', { email: this.email })
        .subscribe({
          next: () => alert('Subscription successful!'),
          error: () => alert('Subscription failed. Please try again.')
        });
    } else {
      alert('Please enter a valid email address.');
    }
  }

  quickLinks = [
    { path: '/home', display: 'Accueil' },
    { path: '/about', display: 'À Propos' },
    { path: '/services', display: 'Services' },
    { path: '/contact', display: 'Contact' },
    { path: '/faq', display: 'FAQ' }
  ];
}
