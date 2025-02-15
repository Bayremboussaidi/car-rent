import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VoitureService } from '../../services/voiture.service';
import { Voiture } from '../../models/voiture.model';

@Component({
  selector: 'app-car-list-a',
  templateUrl: './car-list-a.component.html',
  styleUrls: ['./car-list-a.component.css']
})
export class CarListAComponent implements OnInit {
  cars: Voiture[] = [];
  displayedCars: Voiture[] = [];
  pageSize = 6;
  totalPages = 0;
  currentPage = 1;

  constructor(private voitureService: VoitureService, private router: Router) {}

  ngOnInit() {
    this.fetchAllCars();
  }

  fetchAllCars() {
    this.voitureService.getAllVoituresWithDetails().subscribe(
      (response: { success: boolean; data: Voiture[] }) => {
        if (response.success && response.data) {
          this.cars = response.data.map(car => ({
            ...car,
            image: car.photos && car.photos.length > 0
              ? car.photos[0].displayUrl
              : '/assets/images/default-car.png',
            rating: car.reviews && car.reviews.length > 0
              ? this.calculateAverageRating(car.reviews)
              : 4,
          }));

          this.totalPages = Math.max(1, Math.ceil(this.cars.length / this.pageSize));
          this.updateDisplayedCars();
        }
      },
      (error:any) => console.error('Error fetching all cars:', error)
    );
  }

  updateDisplayedCars() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.displayedCars = this.cars.slice(startIndex, startIndex + this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedCars();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedCars();
    }
  }

  deleteCar(carToDelete: Voiture) {
    this.cars = this.cars.filter(car => car.id !== carToDelete.id);
    this.updateDisplayedCars();
  }

  viewCarDetails(carId: number | undefined) {
    if (carId !== undefined) {
      this.router.navigate(['/car-details', carId]);
    } else {
      console.error("Car ID is undefined, cannot navigate.");
    }
  }

  calculateAverageRating(reviews: { rating: number }[]): number {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return Math.round(totalRating / reviews.length);
  }
}
