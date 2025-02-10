// testimonial.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-testimonial',
  templateUrl: './testimonial.component.html',
  styleUrls: ['./testimonial.component.css']
})
export class TestimonialComponent {
  testimonials = [
    {
      message: "Rapide intéressant merci",
      name: "Med Amine",
      role: "Customer",
      imgUrl: 'assets/all-images/ava-1.jpg' // Adjust path as necessary
    },
    {
      message: "Simple et pratique",
      name: "Mootez",
      role: "Customer",
      imgUrl: 'assets/all-images/ava-1.jpg' // Adjust path as necessary
    },
    {
      message: "Facile et rapide",
      name: "Bilel",
      role: "Customer",
      imgUrl: 'assets/all-images/ava-1.jpg' // Adjust path as necessary
    },
    {
      message: "Simple et pratique",
      name: "Salem",
      role: "Customer",
      imgUrl: 'assets/all-images/ava-1.jpg' // Adjust path as necessary
    }
  ];

  settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 1000,
    swipeToSlide: true,
    autoplaySpeed: 2000,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
}