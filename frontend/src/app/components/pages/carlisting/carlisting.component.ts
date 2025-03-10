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

  voitures: any[] = []; // List of cars
  filteredVoitures: any[] = []; // Filtered list for display
  loading = false;
  error: string = '';

  // ✅ State for Booking Modal
  showBookingModal = false;
  selectedCar: any = null; // Stores selected car details

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
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fetchAllVoitures();
  }

/*  openBookingModal(carId: string) {
    console.log('Opening modal for Car ID:', carId);

    // Prompt the user for a username
    const username = prompt('Enter your username to book this car:');
    if (!username) {
      alert('Username is required!');
      return;
    }

    const id = Number(carId); // Convert to number

    // Fetch car details before booking
    this.voitureService.getOneVoiture(id).subscribe({
      next: (carDetails: any) => {
        // Prepare booking request payload
        const bookingRequest = {
          userId: 1, // Change based on logged-in user
          username: username,
          carName: carDetails.carName, // Fetched from backend
          userEmail: "test@example.com", // Replace with actual authenticated user email
          nbrJrs: 3, // Default to 3 days
          phone: "+21612345678", // Replace with actual user phone
          description: `Booking for ${carDetails.carName}`,
          startDate: "2025-03-10", // Replace with actual user input
          endDate: "2025-03-13", // Replace with actual user input
          voitureId: id, // Assign voitureId from input
          pickupLocation: "Lac2",
          dropoffLocation: "Lac2"
        };

        // Send booking request
        this.BookingService.createBooking(bookingRequest).subscribe({
          next: (response: any) => {
            alert('Car booked successfully!');
            console.log(response);
            this.selectedCarId = id.toString(); // Ensure consistency
            this.showBookingModal = true;
          },
          error: (err: any) => {
            alert('Failed to book the car.');
            console.error(err);
          }
        });
      },
      error: (err: any) => {
        alert('Failed to fetch car details.');
        console.error(err);
      }
    });
  } */


    openBookingModal(voiture: any) {
      console.log('Booking car:', voiture);
      this.selectedCar = voiture; // Store car details
      this.showBookingModal = true; // Show modal
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


