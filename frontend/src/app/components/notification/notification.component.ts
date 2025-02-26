import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../../services/websocket/websocket.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
})
export class NotificationComponent implements OnInit {
  public notifications: string[] = [];
  public privateNotifications: string[] = [];

  constructor(private websocketService: WebsocketService) {}

  ngOnInit() {
    // ✅ Subscribe to public notifications
    this.websocketService.getNotifications().subscribe((message) => {
      if (message) {
        this.notifications.push(message);
      }
    });

    // ✅ Subscribe to private notifications
    this.websocketService.getPrivateNotifications().subscribe((message) => {
      if (message) {
        this.privateNotifications.push(message);
      }
    });
  }

  sendNotification() {
    this.websocketService.sendNotification('New booking request received!');
  }
}
