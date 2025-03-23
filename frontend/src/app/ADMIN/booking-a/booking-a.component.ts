import { Component, OnInit } from '@angular/core';
import { BookingService } from './../../services/booking.service';
import { EmailService } from '../../services/email.service';
import { EmailRequest } from '../../models/emailRequest.model';

interface BookingData {
  id: number;
  userId: number;
  username: string;
  carName: string;
  userEmail: string;
  nbrJrs: number;
  phone: string;
  description: string;
  startDate: string | null;
  endDate: string | null;
  bookingStatus: string; // ✅ Make sure bookingStatus is included
  pickupLocation: string;
  dropoffLocation: string;
  formattedDate?: string; // Optional for UI display
}

@Component({
  selector: 'app-bookings',
  templateUrl: './booking-a.component.html',
  styleUrls: ['./booking-a.component.css']
})
export class BookingAComponent implements OnInit {
  bookings: BookingData[] = []; // ✅ Use the new local BookingData model
  filteredBookings: BookingData[] = [];
  activeButton: string = 'pending'; // Default to 'En Cours' (Pending)

  constructor(private bookingService: BookingService , private emailService: EmailService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  /**
   * Load all bookings from the backend
   */
  loadBookings(): void {
    this.bookingService.getAllBookings().subscribe(
      (response: any) => {
        if (response.success && Array.isArray(response.data)) {
          this.bookings = response.data.map((booking: any) => ({
            ...booking,
            formattedDate: this.formatDate(booking.startDate, booking.endDate)
          }));
          this.showPending(); // Default view
        }
      },
      (error: any) => {
        console.error('❌ Erreur lors de la récupération des réservations:', error);
      }
    );
  }

  /**
   * Format the booking period
   */
  formatDate(startDate: string | null, endDate: string | null): string {
    if (!startDate || !endDate) {
      return 'N/A';
    }
    return `${startDate} - ${endDate}`;
  }

  /**
   * Show only pending bookings (En cours)
   */
  showPending(): void {
    this.filteredBookings = this.bookings.filter(booking => booking.bookingStatus === 'PENDING');
    this.activeButton = 'pending';
  }

  /**
   * Show confirmed or canceled bookings (Traité)
   */
  showTraited(): void {
    this.filteredBookings = this.bookings.filter(booking =>
      booking.bookingStatus === 'CONFIRMED' || booking.bookingStatus === 'CANCELED'
    );
    this.activeButton = 'traited';
  }

  /**
   * Accept a booking (Set status to CONFIRMED)
   */
  accept(booking: BookingData): void {
    this.bookingService.updateBookingStatus(booking.id, 'CONFIRMED').subscribe(
      () => {
        console.log(` Réservation ${booking.id} acceptée.`);
        booking.bookingStatus = 'CONFIRMED'; // ✅ Update UI directly
        this.loadBookings(); //  Force UI refresh

                // Send confirmation email
                const emailRequest: EmailRequest = {
                  name: booking.username,
                  email: booking.userEmail,
                  message: `Votre réservation pour ${booking.carName} a été confirmée.`
                };

                this.emailService.informEmail(emailRequest).subscribe(
                  response => {
                    console.log('Email sent successfully', response);
                  },
                  error => {
                    console.error('Error sending email', error);
                  }
                );
      },
      (error: any) => {
        console.error(' Erreur lors de l\'acceptation de la réservation:', error);
      }
    );
}

refuse(booking: BookingData): void {
    this.bookingService.updateBookingStatus(booking.id, 'CANCELED').subscribe(
      () => {
        console.log(`❌ Réservation ${booking.id} refusée.`);
        booking.bookingStatus = 'CANCELED'; // ✅ Update UI directly
        this.loadBookings(); // ✅ Force UI refresh

                        // Send confirmation email
                        const emailRequest: EmailRequest = {
                          name: booking.username,
                          email: booking.userEmail,
                          message: `Votre réservation pour ${booking.carName} a été réfusé.`
                        };

                        this.emailService.informEmail(emailRequest).subscribe(
                          response => {
                            console.log('Email sent successfully', response);
                          },
                          error => {
                            console.error('Error sending email', error);
                          }
                        );
      },
      (error: any) => {
        console.error('❌ Erreur lors du refus de la réservation:', error);
      }
    );
}


}
