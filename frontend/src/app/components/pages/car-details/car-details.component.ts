import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VoitureService } from '../../../services/voiture.service';

@Component({
  selector: 'app-car-details',
  templateUrl: './car-details.component.html',
  styleUrls: ['./car-details.component.css']
})
export class CarDetailsComponent implements OnInit, OnDestroy {
  carId: number | null = null;
  car: any;
  otherCars: any[] = [];
  currentCarIndex: number = 0;
  carouselInterval: any;
  carImage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private voitureService: VoitureService
  ) {}

  ngOnInit(): void {

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.carId = +id;
        this.loadCarDetails(this.carId);
        this.loadOtherCars(this.carId);
        this.loadCarImage(this.carId);
      }
    });
  }


  loadCarDetails(id: number): void {
    this.voitureService.getVoitureById(id).subscribe(
      (response: any) => {
        if (response && response.success) {
          this.car = response.data;

          // ✅ Ensure reviews exist
          this.car.reviews = this.car.reviews || [];
        } else {
          console.error('Error: Unexpected API response format.');
        }
      },
      (error) => {
        console.error('Error fetching car details:', error);
      }
    );
  }

  // ✅ Function to Generate Stars for Ratings
  getStars(rating: number): number[] {
    return Array(rating).fill(0); // Generates an array with 'rating' number of elements
  }



  loadCarImage(id: number): void {
    this.voitureService.getCarImageById(id).subscribe(
      (response: any) => {
        if (response && response.data) {
          this.carImage = response.data;
        } else {
          console.error('Error: Unexpected API response format for image.');
        }
      },
      (error) => {
        console.error('Error fetching car image:', error);
      }
    );
  }


  loadOtherCars(currentCarId: number): void {
    this.voitureService.getVoitures(0).subscribe(
      (response: any) => {
        if (response && response.data) {

          this.otherCars = response.data
            .filter((car: any) => car.id !== currentCarId)
            .map((car: any) => {
              if (car.imgUrl && !car.imgUrl.startsWith('data:image/png;base64,')) {
                car.imgUrl = `data:image/png;base64,${car.imgUrl}`;
              }
              return car;
            });
          this.startCarousel();
        } else {
          console.error('Unexpected API response format.');
        }
      },
      (error) => {
        console.error('Error fetching other cars:', error);
      }
    );
  }


  startCarousel(): void {
    this.carouselInterval = setInterval(() => {
      this.currentCarIndex = (this.currentCarIndex + 1) % this.otherCars.length;
    }, 9000);
  }

  ngOnDestroy(): void {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
  }
}
