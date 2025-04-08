import { Component } from '@angular/core';
import { VoitureService } from '../../services/voiture.service';
import { Router } from '@angular/router';
import { PhotoService } from '../../services/photo.service';

@Component({
  selector: 'app-add-car',
  templateUrl: './add-car.component.html',
  styleUrls: ['./add-car.component.css']
})
export class AddCarComponent {
  // Voiture model
  voiture: any = {
    carName: '',
    brand: '',
    category: '',
    transmission: 'Automatic',
    matricule: '', // Matricule field
    toit: 'Standard', // Roof type
    carburant: 'Gasoline', // Default dropdown value
    price: 0, // Updated field to match the backend
    agence: '',
    local: '',
    description: '',
    images: [],
    disponible: true
  };

  // Handles selected image files
  imageFiles: File[] = [];

  constructor(
    private voitureService: VoitureService,
    private photoService: PhotoService,
    private router: Router
  ) {}

  // Navigates to the specified path
  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  // Handles image selection from file input
  onImageSelect(event: any): void {
    const files = event.target.files as FileList;
    if (files && files.length > 0) {
      const remainingSlots = 4 - this.imageFiles.length; // Limit to 4 images
      const filesToAdd = Array.from(files).slice(0, remainingSlots); // Ensure no overflow

      filesToAdd.forEach((file: File) => {
        this.imageFiles.push(file);
      });

      console.log(this.imageFiles); // Debugging selected files
    }
  }

  // Generates a preview URL for the image
  getImagePreview(file: File): string {
    return URL.createObjectURL(file); // Convert File to object URL
  }

  // Submits the form data to the backend
  onSubmit(): void {
    if (!this.voiture.carName || !this.voiture.brand || !this.voiture.matricule) {
      alert('Please fill out all required fields (Car Name, Brand, Matricule).');
      return;
    }

    console.log('Sending Voiture Object:', this.voiture); // Log the request body

    this.voitureService.addVoiture(this.voiture).subscribe({
      next: (response: any) => {
        console.log('Full Backend Response:', response); // Log the full response

        // Access the ID directly from the root response
        if (response && response.id) {
          const voitureId = response.id; // Extract ID directly
          console.log('Extracted Voiture ID:', voitureId);

          this.photoService.uploadPhotos(voitureId, null, this.imageFiles).subscribe({
            next: () => {
              console.log('Photos successfully uploaded.');
              this.router.navigate(['/admin/carlista']);
            },
            error: (err) => {
              console.error('Error uploading photos:', err);
              alert('An error occurred while uploading photos. Please try again.');
            }
          });
        } else {
          console.error('Backend response missing ID:', response);
          alert('An error occurred: Voiture ID is missing in the backend response.');
        }
      },
      error: (err) => {
        console.error('Error adding car:', err); // Log full error details
        alert('An error occurred while adding the car. Please try again.');
      }
    });
  }




  // Removes an image from the selected list
  removeImage(index: number): void {
    this.imageFiles.splice(index, 1);
    console.log('Image removed:', this.imageFiles); // Debug after removal
  }
}
