import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppNotification } from '../models/AppNotification.model';

@Injectable({
  providedIn: 'root'
})
export class NotifService {

  private apiUrl = 'http://localhost:8084/notification';

  constructor(private http: HttpClient) {}

  createNotification(notification: AppNotification): Observable<AppNotification> {
    return this.http.post<AppNotification>(this.apiUrl, notification);
  }
}

