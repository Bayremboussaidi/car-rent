import { Component, OnInit } from '@angular/core';
import { VoitureService } from '../../services/voiture.service';
import { Voiture } from '../../models/voiture.model';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-voiture-table',
  templateUrl: './add-voiture.component.html',
  styleUrls: ['./add-voiture.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class AddVoitureComponent implements OnInit {
  voitures: Voiture[] = []; // List of cars
  newCar: Voiture = {} as Voiture; // New car object
  isAddModalOpen: boolean = false; // Control modal visibility
  page: number = 0; // Pagination
  errors: string[] = []; // Error messages

  constructor(
    private voitureService: VoitureService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadVoitures();
  }

  // Load car list from API
  loadVoitures(): void {
    this.voitureService.getVoitures(this.page).subscribe({
      next: (response) => {
        if (response.success) {
          this.voitures = response.data;
        } else {
          this.errors.push(response.message);
        }
      },
      error: (err) => {
        this.errors.push('Failed to load cars: ' + err.message);
      },
    });
  }

  // Open modal to add a car
  openAddModal(): void {
    this.newCar = {} as Voiture;
    this.isAddModalOpen = true;
  }

  // Close modal
  closeAddModal(): void {
    this.isAddModalOpen = false;
  }

  // Handle form submission
  onAddCar(): void {
    this.voitureService.addVoiture(this.newCar).subscribe({
      next: (response) => {
        this.voitures.push(response); // Add new car to list
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Car added successfully',
        });
        this.closeAddModal();
      },
      error: (err) => {
        this.errors.push('Failed to add car: ' + err.message);
      },
    });
  }

  // Delete car
  deleteCar(id: number | undefined, index: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this car?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.voitures.splice(index, 1);
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'Car deleted successfully',
        });
      },
    });
  }
}
