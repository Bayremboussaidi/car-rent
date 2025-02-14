import { Component } from '@angular/core';

@Component({
  selector: 'app-car-list-a',
  templateUrl: './car-list-a.component.html',
  styleUrls: ['./car-list-a.component.css']
})
export class CarListAComponent {
  cars = [
    {
      image: 'assets/images/img_1.jpg',
      name: 'Range Rover S64 Coupe',
      rating: 5,
      price: 250,
      specs: { doors: 4, seats: 5, transmission: 'Automatic', minAge: 18 }
    },
    {
      image: 'assets/images/img_2.jpg',
      name: 'Range Rover S64 Coupe',
      rating: 5,
      price: 250,
      specs: { doors: 4, seats: 5, transmission: 'Automatic', minAge: 18 }
    },
    {
      image: 'assets/images/img_3.jpg',
      name: 'Range Rover S64 Coupe',
      rating: 5,
      price: 250,
      specs: { doors: 4, seats: 5, transmission: 'Automatic', minAge: 18 }
    }
  ];
}
