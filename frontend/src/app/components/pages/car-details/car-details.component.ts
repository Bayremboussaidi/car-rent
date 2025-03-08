import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VoitureService } from '../../../services/voiture.service';
import { PhotoResponseDTO } from '../../../models/PhotoResponseDTO.model';
import { ReviewService } from '../../../services/review-service.service'; // ✅ Import ReviewService
import { Review } from '../../../models/review.model'; // ✅ Import Review Interface


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
  carImages: string[] = [];
  currentImageIndex: number = 0;




  review: { username: string; email: string; reviewText: string; rating: number } = {
    username: '',
    email: '',
    reviewText: '',
    rating: 0
  };

  constructor(
    private route: ActivatedRoute,
    private voitureService: VoitureService,

    private reviewService: ReviewService
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


  previousImage() {
    this.currentImageIndex =
      (this.currentImageIndex - 1 + this.carImages.length) % this.carImages.length;
  }

  nextImage() {
    this.currentImageIndex =
      (this.currentImageIndex + 1) % this.carImages.length;
  }

  loadCarDetails(id: number): void {
    this.voitureService.getVoitureById(id).subscribe(
      (response: any) => {
        if (response && response.success) {
          this.car = response.data;

          //  Ensure reviews exist
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

  // Function to Generate Stars for Ratings
  getStars(rating: number): number[] {
    return Array(rating).fill(0); // Generates an array with 'rating' number of elements
  }

  loadCarImage(id: number): void {
    this.voitureService.getCarImageById(id).subscribe(
      (photos: PhotoResponseDTO[]) => {
        if (photos?.length > 0) {
          // Map all photos to data URLs
          this.carImages = photos.map(photo =>
            `data:${photo.type};base64,${photo.data}`
          );
        } else {
          // Show default image if no photos
          this.carImages = ['/assets/default-car.jpg'];
        }
      },
      (error: any) => {
        console.error('Error fetching car images:', error);
        this.carImages = ['/assets/default-car.jpg'];
      }
    );
  }


  loadOtherCars(currentCarId: number): void {
    this.voitureService.getVoitures(0).subscribe(
      (response: any) => {
        if (response?.data) {
          this.otherCars = response.data
            .filter((car: any) => car.id !== currentCarId)
            .map((car: any) => {
              // Fetch images for each car
              this.voitureService.getCarImageById(car.id).subscribe(photos => {
                if (photos?.length > 0) {
                  car.imgUrl = `data:${photos[0].type};base64,${photos[0].data}`;
                }
              });
              return car;
            });
          this.startCarousel();
        }
      },
      (error) => console.error('Error fetching other cars:', error)
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





  submitReview() {
    if (!this.carId) {
      console.error('Error: No car ID found');
      return;
    }

    const reviewPayload = {
      username: this.review.username,
      email: this.review.email,
      reviewText: this.review.reviewText,
      rating: this.review.rating
    };

    this.reviewService.createReview(this.carId, reviewPayload)
      .subscribe(
        (newReview: Review) => {
          console.log('Review submitted successfully:', newReview);

          // ✅ Update the review list dynamically without reloading
          this.car.reviews.unshift(newReview);

          // ✅ Reset the review form
          this.review = { username: '', email: '', reviewText: '', rating: 0 };
        },
        (error) => {
          console.error('Error submitting review:', error);
        }
      );
  }
}
