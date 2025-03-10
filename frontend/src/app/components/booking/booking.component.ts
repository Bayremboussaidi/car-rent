import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import moment from 'moment';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingModalComponent implements OnInit {
  today: Date = new Date();
  @Input() showModal: boolean = false; // Controls modal visibility
  @Input() voitureId!: string; // Receives car ID from parent as a string
  @Input() carName!: string; // Receives car Name from parent
  @Output() close = new EventEmitter<void>(); // Emit event to close modal

  bookingData = {
    userId: '0',
    username: '*',
    carName: '',
    userEmail: '',
    nbrJrs: 0,
    phone: '',
    description: '',
    startDate: '',
    endDate: '',
    voitureId: '', // Assigned as string before sending request
    pickupLocation: 'lac2,tunis',
    dropoffLocation: 'lac2,tunis'
  };

  responseMessage: string = '';
  unavailableDates: Date[] = [];

  constructor(private bookingService: BookingService) {}

  ngOnInit() {
    if (this.voitureId) {
      this.fetchUnavailableDates();
      this.bookingData.carName = this.carName; // Assign car name
      this.bookingData.voitureId = this.voitureId; // Assign voitureId as string
    }
  }

  /**
   * Fetch unavailable dates for the selected car
   */
  fetchUnavailableDates() {
    if (!this.voitureId) return; // Prevent unnecessary API call

    this.bookingService.getUnavailableDates(this.voitureId).subscribe({
      next: (data) => {
        if (data.unavailableDates) {
          this.unavailableDates = data.unavailableDates.flatMap((booking: any) => {
            const start = moment(booking.startDate);
            const end = moment(booking.endDate);
            let dates = [];
            while (start.isSameOrBefore(end, "day")) {
              dates.push(start.toDate());
              start.add(1, "days");
            }
            return dates;
          });
        }
      },
      error: (error: any) => console.error("Error fetching availability:", error)
    });
  }

  /**
   * Disable unavailable dates on the calendar
   */
  isDateDisabled = (date: Date): boolean => {
    return this.unavailableDates.some(d => moment(d).isSame(date, "day"));
  };

  /**
   * Submit booking request
   */
  onSubmit() {
    // Validate required fields before submitting
    if (!this.voitureId || !this.bookingData.startDate || !this.bookingData.endDate) {
      this.responseMessage = "Please fill in all required fields!";
      return;
    }

    // Assign voitureId and carName correctly
    this.bookingData.voitureId = this.voitureId;
    this.bookingData.carName = this.carName;

    this.bookingService.createBooking(this.bookingData).subscribe({
      next: (response: any) => {
        this.responseMessage = response.message || "Booking successful!"; // Handle potential missing message
        if (response.success) {
          this.fetchUnavailableDates(); // Refresh unavailable dates
          setTimeout(() => this.closeModal(), 2000); // Close modal after success
        }
      },
      error: (error: any) => {
        console.error("Error submitting booking:", error);
        this.responseMessage = error.error?.message || "Booking failed. Please try again.";
      }
    });
  }

  /**
   * Close modal and emit event to parent
   */
  closeModal() {
    this.showModal = false;
    this.close.emit(); // Notify parent to close modal
  }
}
