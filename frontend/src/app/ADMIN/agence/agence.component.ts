import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AgenceService } from '../../services/agence/agence.service';

// Move these interfaces to a shared file (e.g., models/agence.model.ts) if used elsewhere
interface Agence {
  agencyName: string;
  email: string;
  password: string;
  phoneNumber: string;
  city: string; // Changed from optional to required
  photo?: File;
}

interface AgenceResponse {
  success: boolean;
  message: string;
  data?: any;
}

@Component({
  selector: 'app-agence',
  templateUrl: './agence.component.html',
  styleUrls: ['./agence.component.css']
})
export class AgenceComponent {
  signupForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  selectedFile: File | null = null;
  previewImage: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private agenceService: AgenceService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      agencyName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s()-]{7,}$/)]],
      city: ['', Validators.required] // Made city required to match interface
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.previewImage = null;
    this.selectedFile = null;
    const fileInput = document.getElementById('photo') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      this.markFormGroupTouched(this.signupForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Convert to FormData for file upload
    const formData = new FormData();
    formData.append('agencyName', this.signupForm.value.agencyName);
    formData.append('email', this.signupForm.value.email);
    formData.append('password', this.signupForm.value.password);
    formData.append('phoneNumber', this.signupForm.value.phoneNumber);
    formData.append('city', this.signupForm.value.city);
    if (this.selectedFile) {
      formData.append('photo', this.selectedFile);
    }

    this.agenceService.createAgence(formData)
      .pipe(
        catchError(error => {
          this.isLoading = false;
          this.errorMessage = error.message || 'An error occurred during signup';
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (response: any) => { // Changed to any to avoid type issues
          this.isLoading = false;
          if (response?.success) {
            this.router.navigate(['/login'], {
              state: { successMessage: 'Agency created successfully! Please login.' }
            });
          } else {
            this.errorMessage = response?.message || '';
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.message || 'An error occurred during signup';
        }
      });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
