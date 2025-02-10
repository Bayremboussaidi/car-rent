// find-car-form.component.ts
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-find-car-form',
  templateUrl: './find-car-form.component.html',
  styleUrls: ['./find-car-form.component.css']
})
export class FindCarFormComponent {

  contactNumber: string = "+216 12 345 678";
  @ViewChild('localInput') localInput!: ElementRef;

  constructor(private router: Router ) {}

  async searchHandler() {
    const local = this.localInput.nativeElement.value;

    if (local === "") {
      return alert("All fields are required!");
    }



    const res = await fetch(`BASE_URL/voitures/search/getVoitureBySearch?local=${local}`);

    if (!res.ok) {
      alert("Something went wrong");
      return;
    }

    const result = await res.json();
    this.router.navigate(['/voitures/search'], { state: { data: result.data, local } });
  }
}
