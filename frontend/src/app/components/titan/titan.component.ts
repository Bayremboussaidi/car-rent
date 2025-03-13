import { Component, HostListener, inject } from "@angular/core";
import { KeycloakService } from "../../services/keycloak/keycloak.service";
import { Router } from '@angular/router';
import { BookingService } from "../../services/booking.service";
import { Booking } from "../../models/booking.model";
import { MatDialog } from "@angular/material/dialog";
import { EmailDialogComponent } from "../dialog/email-dialog/email-dialog.component";

@Component({
  selector: "app-titan",
  templateUrl: "./titan.component.html",
  styleUrls: ["./titan.component.css"],
})
export class TitanComponent {
  isMenuOpen = false;
  scrollOpacity = 0; // Starts with 0% opacity at the top
  isTopMenuVisible: boolean = true; // Tracks top menu visibility
  userBookings: Booking[] = []; // Store bookings fetched from the server
  responseMessage: string = ""; // Message if no bookings are found
  userEmail: string = ""; // User email input

  constructor(
    private keycloakService: KeycloakService,
    private router: Router,
    private bookingService: BookingService
  ) {}


  readonly dialog = inject(MatDialog);


  openEmailDialog() {
    this.dialog.open(EmailDialogComponent, {
      width: '500vh', // Ensures a reasonable width
      disableClose: false,
      hasBackdrop: true,
      panelClass:  'custom-dialog-container',
    });
  }





  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    this.keycloakService.logout();
  }

  /**
   * Fetch bookings by user email when clicking "Purchase"
   */
  fetchBookingsByEmail() {
    if (!this.userEmail) {
      this.responseMessage = "Veuillez entrer un e-mail valide.";
      return;
    }

    this.bookingService.getBookingsByUserEmail(this.userEmail).subscribe({
      next: (response: { success: boolean; data: Booking[] }) => {
        if (response.success) {
          this.userBookings = response.data;
          this.responseMessage = "";
        } else {
          this.responseMessage = "Aucune réservation trouvée pour cet e-mail.";
          this.userBookings = [];
        }
      },
      error: (error: any) => {
        console.error("Erreur lors de la récupération des réservations:", error);
        this.responseMessage = "Impossible de récupérer les réservations.";
      }
    });
  }

  @HostListener("window:scroll", [])
  onWindowScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const maxOpacity = 1; // Maximum opacity when scrolling down
    const minOpacity = 0; // Fully transparent at the top
    const scrollFactor = 300; // Distance required for full opacity

    // Calculate opacity based on scroll position
    this.scrollOpacity = Math.min(maxOpacity, scrollTop / scrollFactor);

    // Hide top menu after scrolling 50px, and make app-titan move up
    this.isTopMenuVisible = scrollTop < 50;
  }
}
