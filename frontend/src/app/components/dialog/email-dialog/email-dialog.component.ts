import { Component, inject } from '@angular/core';
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

  /**
   * Validate email format
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Handle form submission: Validate email & fetch bookings
   */
  submitEmail() {
    if (!this.isValidEmail(this.email)) return;

    this.isLoading = true; // Show loading state

    // Fetch bookings from API
    this.bookingService.getBookingsByUserEmail(this.email).subscribe({
      next: (response: { success: boolean; data: any[] }) => {
        this.isLoading = false;
        this.bookings = response.success ? response.data : [];
      },
      error: () => {
        this.isLoading = false;
        this.bookings = []; // No bookings found or error occurred
      }
    });
  }

  /**
   * Close the dialog
   */
  closeDialog() {
    this.dialogRef.close();
  }
}
