import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { VoitureService } from '../../services/voiture.service';
import { Router } from '@angular/router';
import { PhotoService } from '../../services/photo.service';



@Component({
  selector: 'app-add-car',
  templateUrl: './add-car.component.html',
  styleUrls: ['./add-car.component.css']
})
export class AddCarComponent {
  voiture: any = {
    carName: '',
    brand: '',
    category: '',
    transmission: 'Automatic',
    carburant: 'Gasoline',
    price: 0,
    agence: '',
    local: '',
    description: '',
    pricePerDay: 0,
    agenceLogo: '',
    images: [],
    disponible: true
  };

  logoPreview: string | null = null;
  logoFile: File | null = null;
  imageFiles: File[] = [];

  constructor(
    private voitureService: VoitureService,
    private photoService: PhotoService,
    private router: Router
  ) {}

  onLogoSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.logoFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.logoPreview = reader.result as string;
        this.voiture.agenceLogo = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onImageSelect(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      const remainingSlots = 5 - this.imageFiles.length;
      const filesToAdd = Array.from(files).slice(0, remainingSlots) as File[];

      filesToAdd.forEach(file => {
        this.imageFiles.push(file);
      });
    }
  }

  onSubmit(): void {
    if (this.logoFile && this.imageFiles.length > 0) {
      // Prepare form data
      const formData = new FormData();
      formData.append('carName', this.voiture.carName);
      formData.append('brand', this.voiture.brand);
      formData.append('category', this.voiture.category);
      formData.append('transmission', this.voiture.transmission);
      formData.append('fuelType', this.voiture.carburant);
      formData.append('price', this.voiture.price.toString());
      formData.append('agency', this.voiture.agence);
      formData.append('location', this.voiture.local);
      formData.append('pricePerDay', this.voiture.pricePerDay.toString());
      formData.append('description', this.voiture.description);
      formData.append('agencyLogo', this.logoFile);

      // Add image files to FormData
      this.imageFiles.forEach(image => {
        formData.append('carImages', image);
      });

      // Add car to the backend
      this.voitureService.addVoiture(formData).subscribe({
        next: (response: any) => {
          // Upload images after car is added
          this.photoService.uploadPhotos(response.id, this.logoFile, this.imageFiles).subscribe({
            next: () => {
              this.router.navigate(['/admin/cars']);
            },
            error: (err) => {
              console.error('Error uploading photos:', err);
            }
          });
        },
        error: (err) => {
          console.error('Error adding car:', err);
        }
      });
    } else {
      alert('Please upload a logo and at least one image.');
    }
  }




  removeImage(index: number): void {
    this.imageFiles.splice(index, 1);
  }
}
