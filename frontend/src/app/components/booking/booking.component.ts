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
  @Input() showModal: boolean = false;
  @Input() voitureId!: string;
  @Input() carName!: string;
  @Output() close = new EventEmitter<void>();

  bookingData = {
    userId: 8,
    username: 'bay',
    carName: '',
    userEmail: '',
    nbrJrs: 0,
    phone: '',
    description: '',
    startDate: '',
    endDate: '',
    voitureId: 0,
    pickupLocation: 'lac2,tunis',
    dropoffLocation: 'lac2,tunis',
  };

  responseMessage: string = '';
  unavailableDates: Date[] = [];

  constructor(private bookingService: BookingService) {}

  ngOnInit() {
    if (this.voitureId) {
      this.bookingData.voitureId = Number(this.voitureId); // ✅ Convert once
      this.bookingData.carName = this.carName;
      this.fetchUnavailableDates();
    }
  }

  fetchUnavailableDates() {
    if (!this.voitureId) return;

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

  isDateDisabled = (date: Date): boolean => {
    return this.unavailableDates.some(d => moment(d).isSame(date, "day"));
  };

  onSubmit() {
    if (!this.voitureId || !this.bookingData.startDate || !this.bookingData.endDate) {
      this.responseMessage = "Please fill in all required fields!";
      return;
    }

    this.bookingData.voitureId = Number(this.voitureId);
    this.bookingData.carName = this.carName;

    if (this.bookingData.startDate && this.bookingData.endDate) {
      this.bookingData.startDate = moment(this.bookingData.startDate).format("YYYY-MM-DD");
      this.bookingData.endDate = moment(this.bookingData.endDate).format("YYYY-MM-DD");
    } else {
      this.responseMessage = "Start date and end date are required!";
      return;
    }

    console.log("🔍 Sending Booking Data:", JSON.stringify(this.bookingData, null, 2));

    this.bookingService.createBooking(this.bookingData).subscribe({
      next: (response: any) => {
        this.responseMessage = response.message || "Booking successful!";
        if (response.success) {
          this.fetchUnavailableDates();
          setTimeout(() => this.closeModal(), 2000);
        }
      },
      error: (error: any) => {
        console.error("Error submitting booking:", error);
        this.responseMessage = error.error?.message || "Booking failed. Please try again.";
      }
    });
  }

  closeModal() {
    this.showModal = false;
    this.close.emit();
  }
}
