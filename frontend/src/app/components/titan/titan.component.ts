import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';
import { UserloginService } from '../../services/user_login/userlogin.service';
import { NotificationComponent } from '../notification/notification.component';
//import { EmailDialogComponent } from '../dialog/email-dialog/email-dialog.component';
import { Booking } from '../../models/booking.model';
import { BookingEmail } from '../../models/booking.model';



import { interval, Subscription } from 'rxjs';
import { VoitureService } from '../../services/voiture.service';
import { PhotoResponseDTO } from '../../models/PhotoResponseDTO.model';


@Component({
  selector: 'app-titan',
  templateUrl: './titan.component.html',
  styleUrls: ['./titan.component.css']
})
export class TitanComponent implements OnInit {
  @ViewChild(NotificationComponent) notificationsComponent!: NotificationComponent;

  // State properties
  isNotificationsVisible = false;

  private refreshSub!: Subscription; //notif refresh

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



  //purchase
  showEmailDialog = false;
  isLoadingDialog = false;
  emailDialogBookings: BookingEmail[] = [];





  constructor(
    public UserloginService: UserloginService,
    private router: Router,
    private bookingService: BookingService,
    private authService: AuthService,
    private dialog: MatDialog,





    private voitureService: VoitureService,
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
          next: (response: { success: boolean; data: BookingEmail[] }) => {
            if (response.success) {
              this.pendingPurchasesCount = response.data.filter(b => b.status === 'PENDING').length;
              this.hasPurchases = response.data.length > 0;
            } else {
              this.pendingPurchasesCount = 0;
              this.hasPurchases = false;
            }
          },
          error: (error) => {
            console.error('Error checking purchase status:', error);
            this.pendingPurchasesCount = 0;
            this.hasPurchases = false;
          }
        });
      }
    }
  }


  /*
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
  }*/





    handleImageError(booking: BookingEmail): void {
      console.warn('Image load failed for booking:', booking.id);
      booking.imgUrl = '/assets/default-car.jpg';

      // Only needed if using ChangeDetectionStrategy.OnPush
      // this.changeDetector.detectChanges();
    }

    openNotif(): void {
      if (this.isLoggedIn) {
        this.isNotificationsVisible = true;
        const user = this.UserloginService.getCurrentUser();

        // Capture email safely and narrow the type
        const email = user?.email;
        if (email) {
          // Clear existing interval (if any)
          if (this.refreshSub) {
            this.refreshSub.unsubscribe();
          }

          // Initial fetch
          this.notificationsComponent.fetchNotifications(email);

          // Refresh every 60 seconds with the latest email
          this.refreshSub = interval(60000).subscribe(() => {
            const currentUser = this.UserloginService.getCurrentUser();
            const currentEmail = currentUser?.email;
            if (currentEmail) {
              this.notificationsComponent.fetchNotifications(currentEmail);
            } else {
              this.closeNotificationsNavbar(); // Handle missing email
            }
          });
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

























//purchase

//tsaker when click outside




/*private loadDialogCarImages(): void {
  this.emailDialogBookings.forEach(booking => {
    this.voitureService.getCarImageById(booking.voitureId).subscribe({
      next: (photos: PhotoResponseDTO[]) => {
        booking.imgUrl = photos && photos.length > 0
          ? `data:${photos[0].type};base64,${photos[0].data}`
          : '/assets/default-car.jpg';
      },
      error: () => {
        booking.imgUrl = '/assets/default-car.jpg';
      }
    });
  });
}


checkBackdropClick(event: MouseEvent): void {
  // Use currentTarget instead of target
  if (event.target === event.currentTarget) {
    this.closeEmailDialog();
  }
}


openEmailDialog(): void {
  if (this.isLoggedIn) {
    this.showEmailDialog = true;
    this.loadEmailDialogBookings();
  } else {
    this.showSignInPrompt = true;
  }
}

closeEmailDialog(): void {
  this.showEmailDialog = false;
}

private loadEmailDialogBookings(): void {
  this.isLoadingDialog = true;
  const user = this.UserloginService.getCurrentUser();

  if (user?.email) {
    this.bookingService.getBookingsByUserEmail(user.email).subscribe({
      next: (response: { success: boolean; data: BookingEmail[] }) => {
        if (response.success) {
          this.emailDialogBookings = response.data.map(booking => ({
            ...booking,
            imgUrl: this.createImageUrl(booking),
            startDate: new Date(booking.startDate),
            endDate: new Date(booking.endDate)
          }));
        }
        this.isLoadingDialog = false;
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
        this.isLoadingDialog = false;
      }
    });
  }
}

private createImageUrl(booking: BookingEmail): string {
  try {
    // Priority 1: Use base64Data + type if available
    if (booking.base64Data && booking.type) {
      return `data:${booking.type};base64,${booking.base64Data}`;
    }
    // Priority 2: Use imageSrc if available
    if (booking.imageSrc) {
      return booking.imageSrc;
    }
    // Fallback to default image
    return '/assets/default-car.jpg';
  } catch (e) {
    console.error('Invalid image data:', booking.id, e);
    return '/assets/default-car.jpg';
  }
}

deleteDialogBooking(bookingId: number): void {
  if (confirm('Are you sure you want to delete this booking?')) {
    this.bookingService.deleteBooking(bookingId).subscribe({
      next: () => {
        this.emailDialogBookings = this.emailDialogBookings.filter(b => b.id !== bookingId);
      },
      error: (error:any) => {
        console.error('Error deleting booking:', error);
      }
    });
  }
}*/

















 // Backdrop click handler
 checkBackdropClick(event: MouseEvent): void {
  if (event.target === event.currentTarget) {
    this.closeEmailDialog();
  }
}

// Dialog control methods
openEmailDialog(): void {
  if (this.isLoggedIn) {
    this.showEmailDialog = true;
    this.loadEmailDialogBookings();
  } else {
    this.showSignInPrompt = true;
  }
}

closeEmailDialog(): void {
  this.showEmailDialog = false;
}

// Data loading methods
private loadEmailDialogBookings(): void {
  this.isLoadingDialog = true;
  const user = this.UserloginService.getCurrentUser();

  if (user?.email) {
    this.bookingService.getBookingsByUserEmail(user.email).subscribe({
      next: (response: { success: boolean; data: any[] }) => {
        if (response.success) {
          this.processBookings(response.data);
        }
        this.isLoadingDialog = false;
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
        this.isLoadingDialog = false;
      }
    });
  }
}

private processBookings(bookingsData: any[]): void {
  this.emailDialogBookings = bookingsData.map(booking => ({
    id: booking.id,
    voitureId: Number(booking.voitureId), // Convert string to number
    userId: 0, // Add default value (not in response)
    username: booking.username,
    carName: booking.carName,
    userEmail: booking.userEmail,
    nbrJrs: booking.nbrJrs,
    phone: booking.phone,
    description: booking.description,
    startDate: new Date(booking.startDate),
    endDate: new Date(booking.endDate),
    status: booking.bookingStatus, // Map bookingStatus to status
    pickupLocation: booking.pickupLocation,
    dropoffLocation: booking.dropoffLocation,
    price: booking.price,
    base64Data: '', // Add empty default
    type: '',        // Add empty default
    imageSrc: '',    // Add empty default
    imgUrl: this.createImageUrl(booking) // Computed property
  }));

  // Load images after initial data setup
  this.loadCarImages();
}

private createImageUrl(booking: BookingEmail): string {
  // Priority 1: Use API image data if available
  if (booking.base64Data && booking.type) {
    return `data:${booking.type};base64,${booking.base64Data}`;
  }

  // Priority 2: Use external image URL
  if (booking.imageSrc) {
    return booking.imageSrc;
  }

  // Fallback to service-based image loading
  return this.loadImageFromService(booking.voitureId);
}

private loadImageFromService(voitureId: number): string {
  // This will be updated by the subsequent service call
  return '/assets/default-car.jpg';
}
private loadCarImages(): void {
  this.emailDialogBookings.forEach(booking => {
    this.voitureService.getCarImageById(booking.voitureId).subscribe({
      next: (photos: PhotoResponseDTO[]) => {
        this.updateBookingImage(booking.id, photos);
      },
      error: () => {
        this.updateBookingImage(booking.id, []);
      }
    });
  });
}

private updateBookingImage(bookingId: number, photos: PhotoResponseDTO[]): void {
  const booking = this.emailDialogBookings.find(b => b.id === bookingId);
  if (booking) {
    booking.imgUrl = photos.length > 0
      ? `data:${photos[0].type};base64,${photos[0].data}`
      : '/assets/default-car.jpg';

    // Create new array reference to trigger change detection
    this.emailDialogBookings = [...this.emailDialogBookings];
  }
}

// Booking actions
deleteDialogBooking(bookingId: number): void {
  if (confirm('Are you sure you want to delete this booking?')) {
    this.bookingService.deleteBooking(bookingId).subscribe({
      next: () => {
        this.emailDialogBookings = this.emailDialogBookings.filter(b => b.id !== bookingId);
      },
      error: (error) => {
        console.error('Error deleting booking:', error);
      }
    });
  }
}




}
