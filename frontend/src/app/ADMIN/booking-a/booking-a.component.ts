import { QRCodeService } from './../../services/qrcode.service';
import { Component, OnInit } from '@angular/core';
import { BookingService } from './../../services/booking.service';
import { EmailService } from '../../services/email.service';
import { EmailRequest } from '../../models/emailRequest.model';
import { ReportRequest } from '../../models/ReportRequest.model';
import { NotifService } from '../../services/notif.service';
import { AppNotification } from '../../models/AppNotification.model';

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
  bookingStatus: string; //  Make sure bookingStatus is included
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

  constructor(private bookingService: BookingService , private emailService: EmailService , private notificationService : NotifService , private qrCodeService : QRCodeService ,

  ) {}

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
        console.error(' Erreur lors de la récupération des réservations:', error);
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



  accept(booking: BookingData): void {
    this.bookingService.updateBookingStatus(booking.id, 'CONFIRMED').subscribe(
      () => {
        console.log(`Réservation ${booking.id} acceptée.`);
        booking.bookingStatus = 'CONFIRMED'; // Update UI directly
        this.loadBookings(); // Force UI refresh

        // Generate QR code data
        const qrCodeData = `Booking ID: ${booking.id}\nCar: ${booking.carName}\nStart Date: ${booking.startDate}\nEnd Date: ${booking.endDate}`;

        // Create report request
        const reportRequest: ReportRequest = {
          name: booking.username,
          email: booking.userEmail,
          message: `Votre réservation pour ${booking.carName} a été confirmée.`,
          qrCode: qrCodeData // Attach QR code data
        };

        // Send confirmation email with QR code and PDF attachment
        this.emailService.sendReportEmail(reportRequest).subscribe(
          response => {
            console.log('Email sent successfully', response);
          },
          error => {
            console.error('Error sending email', error);
          }
        );

        // Send notification request
        const notificationRequest: AppNotification = {
          recipient: booking.userEmail,
          message: `Votre réservation pour ${booking.carName} a été confirmée.`,
          seen: false,
        };

        this.notificationService.createNotification(notificationRequest).subscribe(
          response => {
            console.log('Notification stored successfully', response);
          },
          (error: any) => {
            console.error('Error storing notification', error);
          }
        );
      },
      (error: any) => {
        console.error('Erreur lors de l\'acceptation de la réservation:', error);
      }
    );
  }



refuse(booking: BookingData): void {
  this.bookingService.updateBookingStatus(booking.id, 'CANCELED').subscribe(
    () => {
      console.log(`Réservation ${booking.id} refusée.`);
      booking.bookingStatus = 'CANCELED'; // Update UI directly
      this.loadBookings(); // Force UI refresh

      // Send refusal email
      const emailRequest: EmailRequest = {
        name: booking.username,
        email: booking.userEmail,
        message: `Votre réservation pour ${booking.carName} a été réfusée.`
      };

      this.emailService.informEmail(emailRequest).subscribe(
        (response) => {
          console.log('Email sent successfully', response);
        },
        (error) => {
          console.error('Error sending email', error);
        }
      );

      // Send notification request
      const notificationRequest: AppNotification = {
        recipient: booking.userEmail,
        message: `Votre réservation pour ${booking.carName} a été réfusée.`,
        seen: false
      };

      this.notificationService.createNotification(notificationRequest).subscribe(
        (response) => {
          console.log('Notification stored successfully', response);
        },
        (error: any) => {
          console.error('Error storing notification', error);
        }
      );
    },
    (error: any) => {
      console.error('Erreur lors du refus de la réservation:', error);
    }
  );
}}




















/*accept(booking: BookingData): void {
  this.bookingService.updateBookingStatus(booking.id, 'CONFIRMED').subscribe(
      () => {
          console.log(`Réservation ${booking.id} acceptée.`);
          booking.bookingStatus = 'CONFIRMED'; // Update UI directly
          this.loadBookings(); // Force UI refresh

          // Generate QR code
          const qrCodeData = `Booking ID: ${booking.id}\nCar: ${booking.carName}\nStart Date: ${booking.startDate}\nEnd Date: ${booking.endDate}`;
          const qrCode = this.qrCodeService.generateQRCode(qrCodeData);

          // Generate Jasper Report
          const jasperReport = this.jasperReportService.generateReport(booking, qrCode);

          // Send confirmation email with QR code and Jasper Report
          const reportRequest: ReportRequest = {
              name: booking.username,
              email: booking.userEmail,
              message: `Votre réservation pour ${booking.carName} a été confirmée.`,
              qrCode: qrCode, // Attach QR code
              attachment: jasperReport // Attach Jasper Report
          };

          this.emailService.informEmail(reportRequest).subscribe(
              response => {
                  console.log('Email sent successfully', response);
              },
              error => {
                  console.error('Error sending email', error);
              }
          );

          // Send notification request
          const notificationRequest: AppNotification = {
              recipient: booking.userEmail,
              message: `Votre réservation pour ${booking.carName} a été confirmée.`,
              seen: false,
          };

          this.notificationService.createNotification(notificationRequest).subscribe(
              response => {
                  console.log('Notification stored successfully', response);
              },
              (error: any) => {
                  console.error('Error storing notification', error);
              }
          );
      },
      (error: any) => {
          console.error('Erreur lors de l\'acceptation de la réservation:', error);
      }
  );
}*/

