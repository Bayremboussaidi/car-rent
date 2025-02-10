import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent {
  @Input() selectedCarId: string = ''; // Receives car ID from parent
  @Output() close = new EventEmitter<void>(); // Emit event to close modal

  showModal: boolean = false; // Controls modal visibility

  bookingData = {
    carId: '',
    userId: '',
    startDate: '',
    endDate: ''
  };

  responseMessage: string = '';

  constructor(private bookingService: BookingService) {}

  ngOnInit() {
    if (this.selectedCarId) {
      this.bookingData.carId = this.selectedCarId;
      this.showModal = true; // Open modal when car ID is received
    }
  }

  closeModal() {
    this.showModal = false;
    this.close.emit(); // Emit event to close modal
  }

  onSubmit() {
    this.bookingService.createBooking(this.bookingData).subscribe({
      next: (response) => {
        this.responseMessage = response.message;
        setTimeout(() => this.closeModal(), 2000); // Close after success
      },
      error: (error) => {
        this.responseMessage = error.error.message || 'Booking failed';
      }
    });
  }
}
