import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmailRequest } from '../models/emailRequest.model';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private apiUrl = 'http://localhost:8084/sendEmail';


  constructor(private http: HttpClient) { }


  sendEmail(emailRequest: any): Observable<any> {
    return this.http.post(this.apiUrl, emailRequest);
  }


  informEmail(emailRequest: EmailRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/inform`, emailRequest);
  }
}






