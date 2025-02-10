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

  constructor(
    private voitureService: VoitureService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getCarData();
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



  getCarData(page: number = 0): void {
    this.loading = true;
    this.voitureService.getVoitures(page).subscribe(
      (response: any) => {
        console.log('API Response:', response); // Debugging API response
        if (response && response.data) {
          this.voitures = response.data;

          // ✅ Log `disponible` values for each car
          this.voitures.forEach(car => {
            console.log(`Car: ${car.carName}, Disponible: ${car.disponible}`);
          });

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

}
