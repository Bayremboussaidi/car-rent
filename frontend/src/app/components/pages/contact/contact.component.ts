import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  socialLinks = [
    {
      url: 'https://www.facebook.com/profile.php?id=61567175341859',
      icon: 'ri-facebook-line',
    },
    {
      url: 'https://www.instagram.com/myloc.lac.2/',
      icon: 'ri-instagram-line',
    }
  ];





}
