import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { VoitureService } from '../../../services/voiture.service';
import {BookingService} from '../../../services/booking.service';
import { Router } from '@angular/router';

import { UserloginService } from '../../../services/user_login/userlogin.service';

@Component({
  selector: 'app-listcars',
  templateUrl: './carlisting.component.html',
  styleUrls: ['./carlisting.component.css']
})

export class ListcarsComponent implements OnInit {

  showSignInPrompt = false;


  voitures: any[] = [];
  filteredVoitures: any[] = [];
  loading = false;
  error: string = '';

  // ✅ State for Booking Modal
  showBookingModal = false;
  selectedCar: any = null;

  currentPage = 1;
  totalPages = 1;



  selectedCarId: string = '';


  allVoitures: any[] = [];





  itemsPerPage: number = 6;

  totalVoitures: number = 0;

  constructor(
    private voitureService: VoitureService,
    private BookingService : BookingService,
    private router: Router,
    public UserloginService: UserloginService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fetchAllVoitures();
  }


    openBookingModal(voiture: any) {
      console.log('Is user logged in?', this.isLoggedIn);

      if (this.isLoggedIn) {
      console.log('Booking car:', voiture);
      this.selectedCar = voiture; // Store car details
      this.showBookingModal = true; // Show modal
    } else {
      this.showSignInPrompt = true;
      this.cd.detectChanges();
    }
  }


  //sign in open , close
  navigateToLogin(): void {
    this.router.navigate(['/login']);
    this.closeSignInPrompt();
  }

  closeSignInPrompt(): void {
    this.showSignInPrompt = false;
  }

  get isLoggedIn(): boolean {
    return this.UserloginService.isLoggedIn();
  }




  closeBookingModal() {
    console.log('Closing modal');
    this.showBookingModal = false;
  }

  // Fetch all voitures ONCE
  fetchAllVoitures(): void {
    this.loading = true;
    this.voitureService.getVoitures(0).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response && response.data) {
          this.allVoitures = response.data;
          this.filteredVoitures = [...this.allVoitures];
          this.totalVoitures = this.filteredVoitures.length;
          this.totalPages = Math.ceil(this.totalVoitures / this.itemsPerPage);

          // ✅ Fetch images for each voiture and assign the first one
          this.allVoitures.forEach((voiture: any) => {
            this.voitureService.getCarImageById(voiture.id).subscribe(
              (photos: any[]) => {
                if (photos?.length > 0) {
                  voiture.imgUrl = `data:${photos[0].type};base64,${photos[0].data}`;
                } else {
                  voiture.imgUrl = '/assets/default-car.jpg'; // ✅ Default image if no photos
                }
              },
              (error) => {
                console.error(`Error fetching images for voiture ${voiture.id}:`, error);
                voiture.imgUrl = '/assets/default-car.jpg'; // ✅ Default on error
              }
            );
          });

          this.updateDisplayedVoitures();
        } else {
          this.error = 'No data available.';
          this.allVoitures = [];
          this.filteredVoitures = [];
        }
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching cars:', error);
        this.error = 'Failed to load cars. Please try again.';
        this.loading = false;
      }
    );
  }



  updateDisplayedVoitures(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.voitures = this.filteredVoitures.slice(startIndex, endIndex);
  }




  applyFilters(filters: any): void {
    this.filteredVoitures = this.allVoitures.filter(voiture => {
      // 1️ Pick Up Location Match
      if (filters.local && voiture.local.toLowerCase() !== filters.local.toLowerCase()) {
        return false;
      }

      // 2️ Car Type Match
      if (filters.carType && voiture.category.toLowerCase() !== filters.carType.toLowerCase()) {
        return false;
      }

      // 3️ Availability within selected date range
      if (filters.pickupDate && filters.dropoffDate) {
        const startDate = new Date(filters.pickupDate);
        const endDate = new Date(filters.dropoffDate);
        const isBooked = voiture.bookings?.some((booking: any) => {
          const bookingStart = new Date(booking.startDate);
          const bookingEnd = new Date(booking.endDate);
          return startDate < bookingEnd && endDate > bookingStart;
        });
        if (isBooked) {
          return false;
        }
      }

      return true;
    });

   //sort depending on priorities
    this.filteredVoitures.sort((a, b) => {
      // 1️ "mylock" agency first
      if (a.agence === "mylock" && b.agence !== "mylock") return -1;
      if (b.agence === "mylock" && a.agence !== "mylock") return 1;

      // 2️ Car Type Match (if selected)
      if (filters.carType) {
        if (a.category === filters.carType && b.category !== filters.carType) return -1;
        if (b.category === filters.carType && a.category !== filters.carType) return 1;
      }

      // 3️ Pick-up location match
      if (filters.local) {
        if (a.local === filters.local && b.local !== filters.local) return -1;
        if (b.local === filters.local && a.local !== filters.local) return 1;
      }

      return 0; // No sorting preference
    });

    //  Update pagination correctly
    this.totalVoitures = this.filteredVoitures.length;
    this.totalPages = Math.ceil(this.totalVoitures / this.itemsPerPage);
    this.currentPage = 1;
    this.updateDisplayedVoitures();
  }


  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedVoitures();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedVoitures();
    }
  }
}


