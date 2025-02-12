import { Component, OnInit } from '@angular/core';
import { BookingService } from './../../services/booking.service';
import { Booking } from '../../models/booking.model';

@Component({
  selector: 'app-bookings',
  templateUrl: './booking-a.component.html',
  styleUrls: ['./booking-a.component.css']
})
export class BookingAComponent implements OnInit {
  bookings: Booking[] = [];

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.bookingService.getAllBookings().subscribe(
      (response: any) => {
        if (response.success && Array.isArray(response.data)) {
          this.bookings = response.data.map((booking: Booking) => ({
            ...booking,
            formattedDate: this.formatDate(booking.startDate, booking.endDate) // ✅ Now it exists in the model
          }));
        }
      },
      (error: any) => {
        console.error('Error fetching bookings:', error);
      }
    );
  }

  formatDate(startDate: string | null, endDate: string | null): string {
    if (!startDate || !endDate) {
      return 'N/A';
    }
    return `${startDate} - ${endDate}`;
  }
}
