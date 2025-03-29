import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';
import { UserloginService } from '../../services/user_login/userlogin.service';
import { NotificationComponent } from '../notification/notification.component';
import { EmailDialogComponent } from '../dialog/email-dialog/email-dialog.component';
import { Booking } from '../../models/booking.model';

@Component({
  selector: 'app-titan',
  templateUrl: './titan.component.html',
  styleUrls: ['./titan.component.css']
})
export class TitanComponent implements OnInit {
  @ViewChild(NotificationComponent) notificationsComponent!: NotificationComponent;

  // State properties
  isNotificationsVisible = false;
  hoverState = false;
  hasPurchases = false;
  pendingPurchasesCount = 0;
  showSignInPrompt = false;
  isMenuOpen = false;
  scrollOpacity = 0;
  isTopMenuVisible = true;
  userBookings: Booking[] = [];
  responseMessage = '';
  userEmail = '';

  constructor(
    public UserloginService: UserloginService,
    private router: Router,
    private bookingService: BookingService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  get isLoggedIn(): boolean {
    return this.UserloginService.isLoggedIn();
  }

  ngOnInit(): void {
    setInterval(() => this.checkPurchaseStatus(), 300000);
  }

  checkPurchaseStatus(): void {
    if (this.isLoggedIn) {
      const user = this.UserloginService.getCurrentUser();
      if (user?.email) {
        this.bookingService.getBookingsByUserEmail(user.email).subscribe({
          next: (bookings: Booking[]) => {
            this.pendingPurchasesCount = bookings.filter(b => b.status === 'PENDING').length;
            this.hasPurchases = bookings.length > 0;
          }
        });
      }
    }
  }

  openEmailDialog(): void {
    if (this.isLoggedIn) {
      const user = this.UserloginService.getCurrentUser();
      if (user?.email) {
        this.dialog.open(EmailDialogComponent, {
          width: '600px',
          panelClass: 'booking-dialog',
          data: { email: user.email }
        });
      }
    } else {
      this.showSignInPrompt = true;
    }
  }

  openNotif(): void {
    if (this.isLoggedIn) {
      this.isNotificationsVisible = true;
      const user = this.UserloginService.getCurrentUser();
      if (user?.email) {
        this.notificationsComponent.fetchNotifications(user.email);
      }
    } else {
      this.showSignInPrompt = true;
    }
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
    this.closeSignInPrompt();
  }

  closeSignInPrompt(): void {
    this.showSignInPrompt = false;
  }

  closeNotificationsNavbar(): void {
    this.isNotificationsVisible = false;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    this.authService.logout();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    this.scrollOpacity = Math.min(1, scrollTop / 300);
    this.isTopMenuVisible = scrollTop < 60;
  }
}
