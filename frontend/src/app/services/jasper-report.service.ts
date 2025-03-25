import { Injectable } from '@angular/core';
import { BookingData } from '../models/BookingData.model';

@Injectable({
  providedIn: 'root'
})
export class JasperReportService {

  constructor() { }

  generateReport(booking: BookingData, qrCode: string): any {
    // Implementation to generate Jasper Report
    // Return report file or base64 string
}
}
