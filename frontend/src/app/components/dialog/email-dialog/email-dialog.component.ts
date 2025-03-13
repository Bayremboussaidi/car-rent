/*import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BookingService } from '../../../services/booking.service';

@Component({
  selector: 'app-email-dialog',
  templateUrl: './email-dialog.component.html',
  styleUrls: ['./email-dialog.component.css']
})
export class EmailDialogComponent {
  readonly bookingService = inject(BookingService);
  readonly dialogRef = inject(MatDialogRef<EmailDialogComponent>);

  email: string = '';
  isLoading: boolean = false;
  bookings: any[] | null = null; // Null means still in email entry mode

  constructor() {}





  submitEmail() {
    if (!this.email || this.email.trim() === "") {
        console.error("Error: Email is missing or empty!");
        alert("Veuillez entrer un e-mail valide.");
        return;
    }

    const emailToSend = this.email.trim(); // ✅ Remove encoding
    console.log("Fetching bookings for email:", emailToSend); // ✅ Debugging log

    this.isLoading = true; // Show loading state

    // Fetch bookings from API
    this.bookingService.getBookingsByUserEmail(emailToSend).subscribe({
        next: (response: { success: boolean; data: any[] }) => {
            console.log("API Response:", response);
            this.isLoading = false;
            this.bookings = response.success ? response.data : [];
        },
        error: (error) => {
            this.isLoading = false;
            console.error("Error fetching bookings:", error);
            this.bookings = [];
        }
    });
}



  closeDialog() {
    this.dialogRef.close();
  }





    // ✅ Send DELETE request when the delete button is clicked
    deleteBooking(bookingId: number) {
      if (confirm('Are you sure you want to delete this booking?')) {
        this.bookingService.deleteBooking(bookingId).subscribe(
          () => {
            this.bookings = this.bookings!.filter(b => b.id !== bookingId);
            console.log('Booking deleted successfully.');
          },
          (error:any) => {
            console.error('Error deleting booking:', error);
          }
        );
      }
    }
}
*/











import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BookingService } from '../../../services/booking.service';
import { VoitureService } from '../../../services/voiture.service'; // ✅ Import VoitureService
import { PhotoResponseDTO } from '../../../models/PhotoResponseDTO.model';

@Component({
  selector: 'app-email-dialog',
  templateUrl: './email-dialog.component.html',
  styleUrls: ['./email-dialog.component.css']
})
export class EmailDialogComponent {
  readonly bookingService = inject(BookingService);
  readonly voitureService = inject(VoitureService); // ✅ Inject VoitureService
  readonly dialogRef = inject(MatDialogRef<EmailDialogComponent>);

  email: string = '';
  isLoading: boolean = false;
  bookings: any[] | null = null; // Null means still in email entry mode

  constructor() {}

  /**
   * Handle form submission: Validate email & fetch bookings
   */
  submitEmail() {
    if (!this.email || this.email.trim() === "") {
        console.error("Error: Email is missing or empty!");
        alert("Veuillez entrer un e-mail valide.");
        return;
    }

    const emailToSend = this.email.trim();
    console.log("Fetching bookings for email:", emailToSend);

    this.isLoading = true;

    // Fetch bookings from API
    this.bookingService.getBookingsByUserEmail(emailToSend).subscribe({
        next: (response: { success: boolean; data: any[] }) => {
            console.log("API Response:", response);
            this.isLoading = false;
            this.bookings = response.success ? response.data : [];

            // ✅ Fetch images for each booking using the same method as `car-details.component.ts`
            this.bookings.forEach(booking => this.loadCarImages(booking));
        },
        error: (error) => {
            this.isLoading = false;
            console.error("Error fetching bookings:", error);
            this.bookings = [];
        }
    });
  }

  /**
   * Fetch and assign car images for each booking
   */
  loadCarImages(booking: any): void {
    this.voitureService.getCarImageById(booking.voitureId).subscribe(
      (photos: PhotoResponseDTO[]) => {
        if (photos?.length > 0) {
          booking.imgUrl = `data:${photos[0].type};base64,${photos[0].data}`;
        } else {
          booking.imgUrl = '/assets/default-car.jpg'; // ✅ Default image if no photos found
        }
      },
      (error) => {
        console.error(`Error fetching image for voitureId ${booking.voitureId}:`, error);
        booking.imgUrl = '/assets/default-car.jpg'; // ✅ Default image on error
      }
    );
  }

  /**
   * Send DELETE request when the delete button is clicked
   */
  deleteBooking(bookingId: number) {
    if (confirm('Are you sure you want to delete this booking?')) {
      this.bookingService.deleteBooking(bookingId).subscribe(
        () => {
          this.bookings = this.bookings!.filter(b => b.id !== bookingId);
          console.log('Booking deleted successfully.');
        },
        (error:any) => {
          console.error('Error deleting booking:', error);
        }
      );
    }
  }

  /**
   * Close the dialog
   */
  closeDialog() {
    this.dialogRef.close();
  }
}
