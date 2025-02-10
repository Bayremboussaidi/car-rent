import { BookingService } from './../../services/booking.service';

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bookings',
  templateUrl: './booking-a.component.html',
  styleUrls: ['./booking-a.component.css']
})
export class BookingAComponent implements OnInit {
  bookings: any[] = [];

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.bookingService.getAllBookings().subscribe(
      (data:any) => {
        this.bookings = data;
        console.log('Bookings loaded:', this.bookings);
      },
      (error:any) => {
        console.error('Error fetching bookings:', error);
      }
    );
  }
}
