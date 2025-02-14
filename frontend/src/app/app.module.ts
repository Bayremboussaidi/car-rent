import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/pages/home/home.component';
import { AboutSectionComponent } from './components/about-section/about-section.component';
import { BecomeDriverSectionComponent } from './components/become-driver-section/become-driver-section.component';
import { AboutComponent } from './components/pages/about/about.component';
import { BlogComponent } from './components/pages/blog/blog.component';
import { ContactComponent } from './components/pages/contact/contact.component';
import { HeroSliderComponent } from './components/hero-slider/hero-slider.component';
import { FindCarFormComponent } from './components/find-car-form/find-car-form.component';
import { ServicesListComponent } from './components/services-list/services-list.component';
import { ServiceItemComponent } from './components/service-item/service-item.component';
import { FeaturedVoitureListComponent } from './components/featured-voiture-list/featured-voiture-list.component';
import { TestimonialComponent } from './components/testimonial/testimonial.component';
import { RegisterComponent } from './components/pages/register/register.component';
import { ThankYouComponent } from './components/pages/thank-you/thank-you.component';
import { NotFoundComponent } from './components/pages/not-found/not-found.component';
import { BlogDetailsComponent } from './components/blog-details/blog-details.component';
import { BlogListComponent } from './components/blog-list/blog-list.component';
import { CommonSectionComponent } from './components/common-section/common-section.component';
import { LoginComponent } from './components/pages/login/login.component';
import { ListcarsComponent } from './components/pages/carlisting/carlisting.component';
import { DashComponent } from './ADMIN/dash/dash.component';
import { AddVoitureComponent } from './ADMIN/voiture-a/add-voiture.component';
import { CarDetailsComponent } from './components/pages/car-details/car-details.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TestComponent } from './test/test.component';
import { VideoPlayerComponent } from './components/video-player/video-player.component';
import { BookingComponent } from './components/booking/booking.component';
import { UserAComponent } from './ADMIN/users-a/users-a.component';
import { BookingAComponent } from './ADMIN/booking-a/booking-a.component';
import { ReviewsAComponent } from './ADMIN/reviews-a/reviews-a.component';
import { PhotoAComponent } from './ADMIN/photo-a/photo-a.component';
import { APP_BASE_HREF } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import { HeaderAComponent } from './ADMIN/header-a/header-a.component';
import { CarListAComponent } from './ADMIN/car-list-a/car-list-a.component';
//import { KeycloakService } from './services/keycloak.service';

/*
export function initializeKeycloak(keycloak: KeycloakService) {
  return () => keycloak.init();
}*/

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    HomeComponent,
    AboutSectionComponent,
    BecomeDriverSectionComponent,
    AboutComponent,
    BlogComponent,
    BlogDetailsComponent,
    ContactComponent,
    HeroSliderComponent,
    FindCarFormComponent,
    ServicesListComponent,
    ServiceItemComponent,
    FeaturedVoitureListComponent,
    TestimonialComponent,
    RegisterComponent,
    ThankYouComponent,
    NotFoundComponent,
    BlogListComponent,
    CommonSectionComponent,
    LoginComponent,
    ListcarsComponent,
    DashComponent,
    AddVoitureComponent,
    CarDetailsComponent,
    TestComponent,
    VideoPlayerComponent,
    BookingComponent,
    UserAComponent,
    BookingAComponent,
    ReviewsAComponent,
    PhotoAComponent,
    AdminLayoutComponent,
    UserLayoutComponent,
    HeaderAComponent,
    CarListAComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FontAwesomeModule,
    SlickCarouselModule,
    //NgxSliderModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    DialogModule,
    CheckboxModule,
  ],
  providers: [
    HttpClient,
    /*KeycloakService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      deps: [KeycloakService],
      multi: true,
    },*/
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
