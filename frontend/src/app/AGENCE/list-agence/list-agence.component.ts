import { Component } from '@angular/core';
import { VoitureService } from '../../services/voiture.service';
import { Router } from '@angular/router';
import { ApiResponseAgence , Voiture} from '../../models/ApiResponseAgence';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-list-agence',
  templateUrl: './list-agence.component.html',
  styleUrls: ['./list-agence.component.css']
})
export class ListAgenceComponent {
  agencyName = "Tesla Agency";
  cars: Voiture[] = [];
  displayedCars: Voiture[] = [];
  pageSize = 6;
  totalPages = 0;
  currentPage = 1;

  constructor(
    private voitureService: VoitureService,
    private router: Router,private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Access the query params here
    this.route.queryParams.subscribe(params => {
      this.agencyName = params['agencyName'];
      console.log('Agency Name:', this.agencyName);
    });



    this.loadAgencyVoitures(this.agencyName);
  }

  loadAgencyVoitures(agencyName: string) {
    this.voitureService.getVoituresByAgence(agencyName).subscribe({
      next: (response: ApiResponseAgence) => {
        this.cars = response.data;
        this.totalPages = Math.ceil(this.cars.length / this.pageSize);
        this.currentPage = 1;
        this.updateDisplayedCars();
      },
      error: (err) => {
        console.error('Error fetching voitures:', err);
      }
    });
  }

  handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = '/assets/images/default-car.png';
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

  deleteCar(car: Voiture) {
    if (confirm(`Are you sure you want to delete ${car.carName}?`)) {
      this.voitureService.deleteVoiture(car.id).subscribe({
        next: () => {
          this.cars = this.cars.filter(v => v.id !== car.id);
          this.totalPages = Math.ceil(this.cars.length / this.pageSize);
          this.updateDisplayedCars();
        },
        error: (err) => {
          console.error('Error deleting car:', err);
        }
      });
    }
  }

  viewCarDetails(carId: number) {
    console.log(carId);
    this.router.navigate(['/admin', 'carlista', carId]);
  }

  getStars(rating: number): any[] {
    return Array(Math.floor(rating)).fill(0);
  }
}
