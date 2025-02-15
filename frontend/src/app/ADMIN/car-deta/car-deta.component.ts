import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VoitureService } from '../../services/voiture.service';
import { Voiture } from '../../models/voiture.model';
import { Review } from '../../models/review.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-car-deta',
  templateUrl: './car-deta.component.html',
  styleUrls: ['./car-deta.component.css'],
  providers: [MessageService]
})
export class CarDetaComponent implements OnInit {
  car: Voiture | null = null;
  cars: Voiture[] = [];
  reviews: Review[] = [];
  selectedFile: File | null = null; // ✅ Declare and initialize

  availabilityOptions = [
    { label: 'Available', value: true },
    { label: 'Not Available', value: false }
  ];

  constructor(
    private route: ActivatedRoute,
    private voitureService: VoitureService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const carId = Number(params.get('id'));
      if (carId) {
        this.fetchCarDetails(carId);
      }
    });
  }

  fetchCarDetails(carId: number) {
    this.voitureService.getVoitureById(carId).subscribe(
      (response: { success: boolean; data: Voiture }) => {
        if (response.success && response.data) {
          this.car = response.data;
          this.cars = [this.car]; // Store in array for table display

          // Ensure reviews are properly mapped
          this.reviews = (this.car.reviews || []).map((review: any) => ({
            id: review.id ?? 0,
            username: review.username || 'Anonymous',
            reviewText: review.reviewText || '',
            rating: review.rating ?? 0,
            createdAt: review.createdAt ? new Date(review.createdAt).toISOString() : new Date().toISOString(),
            updatedAt: review.updatedAt ? new Date(review.updatedAt).toISOString() : new Date().toISOString()
          }));
        }
      },
      (error) => console.error('Error fetching car details:', error)
    );
  }

  onRowEditInit(car: Voiture) {
    this.messageService.add({ severity: 'info', summary: 'Edit Mode', detail: `Editing ${car.carName}` });
  }

  onRowEditSave(car: Voiture) {
    if (!car.id) {
      console.error("Car ID is missing!");
      return;
    }

    this.voitureService.updateVoiture(car.id, car).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: `Updated ${car.carName}` });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not update the car' });
      }
    });
  }

  onRowEditCancel(car: Voiture, index: number) {
    this.messageService.add({ severity: 'warn', summary: 'Edit Cancelled', detail: `Changes discarded for ${car.carName}` });
    this.fetchCarDetails(car.id!); // Reload original data
  }

  getStars(rating: number): number[] {
    return Array.from({ length: rating }, (_, i) => i + 1);
  }

  // ✅ Handle File Selection
  onFileSelected(event: any) {
    if (event.files && event.files.length > 0) {
      this.selectedFile = event.files[0];
      console.log("Selected file:", this.selectedFile?.name);
    } else {
      this.selectedFile = null; // ✅ Ensure reset if no file selected
    }
  }

  // ✅ Upload File
  uploadImage() {
    if (!this.car || !this.car.id) {
      console.error("Car ID is missing!");
      return;
    }

    if (!this.selectedFile) {
      console.error("No file selected!");
      return;
    }

    this.voitureService.updateVoiture(this.car.id, this.car, this.selectedFile).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Car image updated' });
        this.selectedFile = null; // ✅ Reset file after successful upload
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not update car image' });
      }
    });
  }
}
