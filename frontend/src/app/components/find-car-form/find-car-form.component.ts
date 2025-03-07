import { Component, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-find-car-form',
  templateUrl: './find-car-form.component.html',
  styleUrls: ['./find-car-form.component.css']
})
export class FindCarFormComponent {

  @ViewChild('localInput') localInput!: ElementRef;
  @ViewChild('pickupDateInput') pickupDateInput!: ElementRef;
  @ViewChild('dropoffDateInput') dropoffDateInput!: ElementRef;
  @ViewChild('numPlacesInput') numPlacesInput!: ElementRef;
  @ViewChild('carTypeInput') carTypeInput!: ElementRef;

  @Output() searchFilters = new EventEmitter<any>(); // ✅ Sends filters to ListcarsComponent

  searchHandler() {
    const filters: any = {
      local: this.localInput.nativeElement.value.trim(),
      pickupDate: this.pickupDateInput.nativeElement.value || null,
      dropoffDate: this.dropoffDateInput.nativeElement.value || null,
      numPlaces: this.numPlacesInput.nativeElement.value || null, // ✅ Added in the middle
      carType: this.carTypeInput.nativeElement.value || null
    };

    // ✅ Remove empty filters to avoid unnecessary parameters
    Object.keys(filters).forEach(key => {
      if (!filters[key]) delete filters[key];
    });

    // ✅ Ensure at least one filter is applied
    if (Object.keys(filters).length === 0) {
      return alert("Please enter at least one search criteria.");
    }

    // ✅ Emit filters to the parent component (ListcarsComponent)
    this.searchFilters.emit(filters);
  }
}
