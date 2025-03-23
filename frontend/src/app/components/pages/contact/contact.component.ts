import { Component } from '@angular/core';
import { EmailService } from '../../../services/email.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  name: string = '';
  email: string = '';
  message: string = '';

  constructor(private emailService: EmailService) {}

  sendMessage() {
    const emailRequest = {
      name: this.name,
      email: this.email,
      message: this.message
    };
    this.emailService.sendEmail(emailRequest)
    .subscribe(response => {
      console.log('Email sent successfully', response);
    }, error => {
      console.error('Error sending email', error);
    });
  }


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
