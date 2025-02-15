import { Component, AfterViewInit } from '@angular/core';
import Swiper from 'swiper';
import { Pagination, Autoplay } from 'swiper/modules';

@Component({
  selector: 'app-testimonial',
  templateUrl: './testimonial.component.html',
  styleUrls: ['./testimonial.component.css']
})
export class TestimonialComponent implements AfterViewInit {
  testimonials = [
    {
      text: "Proin iaculis purus consequat sem cure digni ssim donec porttitora entum suscipit rhoncus.",
      image: "assets/img/testimonials/testimonials-1.jpg",
      name: "Saul Goodman",
      role: "Ceo & Founder"
    },
    {
      text: "Export tempor illum tamen malis malis eram quae irure esse labore quem cillum quid.",
      image: "assets/img/testimonials/testimonials-2.jpg",
      name: "Sara Wilsson",
      role: "Designer"
    },
    {
      text: "Enim nisi quem export duis labore cillum quae magna enim sint quorum nulla quem veniam.",
      image: "assets/img/testimonials/testimonials-3.jpg",
      name: "Jena Karlis",
      role: "Store Owner"
    },
    {
      text: "Fugiat enim eram quae cillum dolore dolor amet nulla culpa multos export minim fugiat.",
      image: "assets/img/testimonials/testimonials-4.jpg",
      name: "Matt Brandon",
      role: "Freelancer"
    },
    {
      text: "Quis quorum aliqua sint quem legam fore sunt eram irure aliqua veniam tempor noster veniam sunt culpa.",
      image: "assets/img/testimonials/testimonials-5.jpg",
      name: "John Larson",
      role: "Entrepreneur"
    }
  ];

  ngAfterViewInit() {
    new Swiper('.mySwiper', {
      modules: [Pagination, Autoplay],
      loop: true,
      speed: 600,
      autoplay: {
        delay: 5000
      },
      slidesPerView: "auto",
      pagination: {
        el: ".swiper-pagination",
        clickable: true
      },
      breakpoints: {
        320: {
          slidesPerView: 1,
          spaceBetween: 40
        },
        1200: {
          slidesPerView: 3,
          spaceBetween: 1
        }
      }
    });
  }
}
