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
  voitures: any[] = [];
  loading: boolean = false;
  error: string = '';

  // ✅ Pagination Variables (Adjusted for API)
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 0;

  constructor(
    private voitureService: VoitureService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getTotalPages(); // ✅ First, get total pages
    this.getCarData(this.currentPage); // ✅ Then fetch cars for first page
  }

  openBookingModal(carId: string) {
    console.log('Opening modal for Car ID:', carId); // Debugging
    this.selectedCarId = carId;
    this.showBookingModal = true;
  }

  closeBookingModal() {
    console.log('Closing modal'); // Debugging
    this.showBookingModal = false;
  }

  // ✅ Get the total number of pages (based on API)
  getTotalPages(): void {
    this.voitureService.getVoitureCount().subscribe(
      (response: any) => {
        const totalVoitures = response; // Assuming API returns total count
        this.totalPages = Math.ceil(totalVoitures / this.itemsPerPage);
      },
      (error) => {
        console.error('Error fetching total voiture count:', error);
      }
    );
  }

  // ✅ Fetch car data for the current page
  getCarData(page: number): void {
    this.loading = true;
    this.voitureService.getVoitures(page - 1).subscribe( // ✅ Adjusting for 0-based indexing
      (response: any) => {
        console.log('API Response:', response); // Debugging API response
        if (response && response.data) {
          this.voitures = response.data;
        } else {
          this.error = 'No data available.';
          this.voitures = [];
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

  // ✅ Pagination Functions
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getCarData(this.currentPage);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getCarData(this.currentPage);
    }
  }
}
