import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { VoitureService } from '../../../services/voiture.service';
import {BookingService} from '../../../services/booking.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listcars',
  templateUrl: './carlisting.component.html',
  styleUrls: ['./carlisting.component.css']
})
export class ListcarsComponent implements OnInit {
  selectedCarId: string = '';
  showBookingModal: boolean = false;
  voitures: any[] = [];
  allVoitures: any[] = [];
  filteredVoitures: any[] = [];
  loading: boolean = false;
  error: string = '';

  // ✅ Pagination Variables
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 0;
  totalVoitures: number = 0;

  constructor(
    private voitureService: VoitureService,
    private BookingService : BookingService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fetchAllVoitures();
  }

  openBookingModal(carId: string) {
    console.log('Opening modal for Car ID:', carId);

    // Prompt the user for a username
    const username = prompt('Enter your username to book this car:');
    if (!username) {
      alert('Username is required!');
      return;
    }

    // Prepare booking request payload
    const bookingRequest = {
      username: username,
      carName: "", // This will be fetched from the service
      userEmail: "test@example.com", // Replace with actual authenticated user email
      nbrJrs: 3, // Default to 3 days (can be changed)
      phone: "+21612345678", // Replace with actual user phone number
      description: `Booking for Car ID ${carId}`,
      startDate: "2025-03-10", // Replace with actual user input
      endDate: "2025-03-13", // Replace with actual user input
      bookingStatus: "PENDING",
      pickupLocation: "Lac2",
      dropoffLocation: "Lac2"
    };

    // Fetch car details from backend before sending the request
    const id = Number(carId);//cast to number
    this.voitureService.getOneVoiture(id).subscribe({
      next: (carDetails:any) => {
        // Populate car-specific details
        bookingRequest.carName = carDetails.carName;

        // Send booking request
        this.BookingService.createBooking(id, bookingRequest).subscribe({
          next: (response:any ) => {
            alert('Car booked successfully!');
            console.log(response);
            this.selectedCarId = carId;
            this.showBookingModal = true;
          },
          error: (err:any) => {
            alert('Failed to book the car.');
            console.error(err);
          }
        });
      },
      error: (err:any) => {
        alert('Failed to fetch car details.');
        console.error(err);
      }
    });
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


