// hero-slider.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hero-slider',
  templateUrl: './hero-slider.component.html',
  styleUrls: ['./hero-slider.component.css']
})
export class HeroSliderComponent {/*
  slides = [
    {
      title: 'Les principales agences de location de voitures en un seul endroit',
      subtitle: 'entrez et vérifiez !',
      image: 'slider-1.jpg',
      link: '/cars'
    },
    {
      title: 'Explorez notre gamme de véhicules, conçue pour répondre à toutes vos envies et besoins.',
      subtitle: 'Les prix les plus bas de l\'univers...',
      image: 'slider-2.jpg',
      link: '/cars'
    },
    {
      title: 'Les principales agences de location de voitures en un seul endroit',
      subtitle: 'Meilleur prix garanti',
      image: 'slider-3.jpg',
      link: '/cars'
    }
  ];*/


  settings = {
    fade: true,
    speed: 2000,
    autoplaySpeed: 3000,
    infinite: true,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: false,
  };

  constructor(private router: Router) {}

  navigateToCars() {
    this.router.navigate(['/listcars']);
  }
}
