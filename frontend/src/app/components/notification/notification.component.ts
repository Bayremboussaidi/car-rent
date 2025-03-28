import { Component, OnInit } from '@angular/core';
import { NotifService } from '../../services/notif.service';

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

      this.fetchNotifications(userDetails.email);


  }


  fetchNotifications(recipient: string) {
    this.notificationService.getNotificationsByRecipient(recipient).subscribe(
      (data:any) => {
        this.notifications = data;
      },
      (error:any) => {
        console.error('Error fetching notifications:', error);
      }
    );
  }

}
