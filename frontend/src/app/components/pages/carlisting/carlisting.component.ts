
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { VoitureService } from '../../../services/voiture.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listcars',
  templateUrl: './carlisting.component.html',
  styleUrls: ['./carlisting.component.css']
})
export class ListcarsComponent implements OnInit {
  selectedCarId: string = '';
  showBookingModal: boolean = false;
  voitures: any[] = []; // ✅ Displayed cars per page
  allVoitures: any[] = []; // ✅ All cars from backend
  filteredVoitures: any[] = []; // ✅ Filtered list of cars
  loading: boolean = false;
  error: string = '';

  // ✅ Pagination Variables
  currentPage: number = 1;
  itemsPerPage: number = 6; // ✅ Ensure each page has 6 items
  totalPages: number = 0;
  totalVoitures: number = 0;

  constructor(
    private voitureService: VoitureService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fetchAllVoitures(); // ✅ Fetch everything at once
  }

  openBookingModal(carId: string) {
    console.log('Opening modal for Car ID:', carId);
    this.selectedCarId = carId;
    this.showBookingModal = true;
  }

  closeBookingModal() {
    console.log('Closing modal');
    this.showBookingModal = false;
  }

  // ✅ Fetch all voitures ONCE
  fetchAllVoitures(): void {
    this.loading = true;
    this.voitureService.getVoitures(0).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response && response.data) {
          this.allVoitures = response.data; // ✅ Store all voitures
          this.filteredVoitures = [...this.allVoitures]; // ✅ Default: show all cars
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

  // ✅ Update voitures displayed on the current page
  updateDisplayedVoitures(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.voitures = this.filteredVoitures.slice(startIndex, endIndex); // ✅ Ensure only 6 items per page
  }

  // ✅ Handle filtering when search is executed
  applyFilters(filters: any): void {
    this.filteredVoitures = this.allVoitures.filter(voiture => {
      // 1️⃣ Pick Up Location Match
      if (filters.local && voiture.local.toLowerCase() !== filters.local.toLowerCase()) {
        return false;
      }

      // 2️⃣ Car Type Match
      if (filters.carType && voiture.category.toLowerCase() !== filters.carType.toLowerCase()) {
        return false;
      }

      // 3️⃣ Availability within selected date range
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

      return true; // ✅ If it passes all checks, keep this voiture
    });

    // ✅ Sorting priority rules:
    this.filteredVoitures.sort((a, b) => {
      // 1️⃣ "mylock" agency first
      if (a.agence === "mylock" && b.agence !== "mylock") return -1;
      if (b.agence === "mylock" && a.agence !== "mylock") return 1;

      // 2️⃣ Car Type Match (if selected)
      if (filters.carType) {
        if (a.category === filters.carType && b.category !== filters.carType) return -1;
        if (b.category === filters.carType && a.category !== filters.carType) return 1;
      }

      // 3️⃣ Pick-up location match
      if (filters.local) {
        if (a.local === filters.local && b.local !== filters.local) return -1;
        if (b.local === filters.local && a.local !== filters.local) return 1;
      }

      return 0; // No sorting preference
    });

    // ✅ Update pagination correctly
    this.totalVoitures = this.filteredVoitures.length;
    this.totalPages = Math.ceil(this.totalVoitures / this.itemsPerPage);
    this.currentPage = 1; // ✅ Reset to first page after filtering
    this.updateDisplayedVoitures();
  }

  // ✅ Pagination Functions
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
