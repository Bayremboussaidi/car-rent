



import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-become-driver-section',
  templateUrl: './become-driver-section.component.html',
  styleUrl: './become-driver-section.component.css'
})
export class BecomeDriverSectionComponent implements OnInit {
  backgroundImage = '../../../assets/all-images/drive.jpg';

  testimonials = [
    {
      text: "I am alone, and feel the charm of existence in this spot, which was created for the bliss of souls like mine.",
      author: "Jack Woods",
      company: "SomeCompany INC, CEO"
    },
    {
      text: "I should be incapable of drawing a single stroke at the present moment; and yet I feel that I never was a greater artist than now.",
      author: "Jim Stone",
      company: "SomeCompany INC, CEO"
    },
    {
      text: "I am so happy, my dear friend, so absorbed in the exquisite sense of mere tranquil existence, that I neglect my talents.",
      author: "Adele Snow",
      company: "SomeCompany INC, CEO"
    }
  ];

  activeSlide = 0;
  interval: any;
  cursorStyle = 'default';

  ngOnInit() {
    this.startAutoSlide();
  }

  setActiveSlide(index: number) {
    this.activeSlide = index;
    this.resetAutoSlide();
  }

  nextSlide() {
    this.activeSlide = (this.activeSlide + 1) % this.testimonials.length;
    this.resetAutoSlide();
  }

  prevSlide() {
    this.activeSlide = (this.activeSlide - 1 + this.testimonials.length) % this.testimonials.length;
    this.resetAutoSlide();
  }

  startAutoSlide() {
    this.interval = setInterval(() => {
      this.nextSlide();
    }, 5000); // Change every 5 seconds
  }

  resetAutoSlide() {
    clearInterval(this.interval);
    this.startAutoSlide();
  }

  /* Detect Mouse Movement to Change Cursor */
  @HostListener('document:mousemove', ['$event'])
  handleMouseMove(event: MouseEvent) {
    const screenWidth = window.innerWidth;
    const mouseX = event.clientX;

    if (mouseX < screenWidth / 2) {
      this.cursorStyle = "w-resize"; // Change to `<` when moving left
    } else {
      this.cursorStyle = "e-resize"; // Change to `>` when moving right
    }
  }

  /* Handle Click to Change Slide */
  @HostListener('document:click', ['$event'])
  handleClick(event: MouseEvent) {
    const screenWidth = window.innerWidth;
    const clickX = event.clientX;

    if (clickX < screenWidth / 2) {
      this.prevSlide(); // Click left = Previous slide
    } else {
      this.nextSlide(); // Click right = Next slide
    }
  }
}
