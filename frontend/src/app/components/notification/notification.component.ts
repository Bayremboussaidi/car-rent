import { Component, OnInit } from '@angular/core';
import { NotifService } from '../../services/notif.service';
import { Notification } from '../../models/Notification.model';

@Component({
  selector: 'app-notifications',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
})
export class NotificationComponent implements OnInit {
  notifications: Notification[] = [];

  constructor(private notificationService: NotifService) {}

  ngOnInit() {
   // Initial fetch if needed
const userDetails = JSON.parse(localStorage.getItem('user') || '{}');
  if (userDetails.email) {
    this.fetchNotifications(userDetails.email);
  }
  }


  fetchNotifications(recipient: string) {
    console.log('fetchNotifications called for recipient:', recipient);
    this.notificationService.getNotificationsByRecipient(recipient).subscribe(
      (data) => {
        console.log('Notifications fetched:', data);
        this.notifications = data;
      },
      (error) => {
        console.error('Error fetching notifications:', error);
      }
    );
  }

}
