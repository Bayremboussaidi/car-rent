import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { AboutComponent } from './components/pages/about/about.component';
import { BlogComponent } from './components/pages/blog/blog.component';
import { BlogDetailsComponent } from './components/blog-details/blog-details.component';
import { NotFoundComponent } from './components/pages/not-found/not-found.component';
import { ContactComponent } from './components/pages/contact/contact.component';
//import { CarSearchComponent } from './components/pages/car-search/car-search.component';
import { RegisterComponent } from './components/pages/register/register.component';
import { LoginComponent } from './components/pages/login/login.component';
import { ThankYouComponent } from './components/pages/thank-you/thank-you.component';
import { DashComponent } from './ADMIN/dash/dash.component';
import {AddVoitureComponent} from './ADMIN/voiture-a/add-voiture.component'
import { FooterComponent } from './components/footer/footer.component';
import { ListcarsComponent } from './components/pages/carlisting/carlisting.component';
import { CarDetailsComponent } from './components/pages/car-details/car-details.component';
import { TestComponent } from './test/test.component';
import { UserListComponent } from './ADMIN/users-a/users-a.component';
import { BookingAComponent } from './ADMIN/booking-a/booking-a.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'listcars', component: ListcarsComponent },
  { path: 'listcars/:id', component: CarDetailsComponent },


  { path: 'blogs', component: BlogComponent },
  { path: 'blogs/:id', component: BlogDetailsComponent },
  { path: 'contact', component: ContactComponent },
  //{ path: 'voitures/search', component: CarSearchComponent }, // Car search page
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'footer', component: FooterComponent },

  { path: 'thank-you', component: ThankYouComponent },
  //{ path: '**', component: NotFoundComponent },
  { path: 'test' , component: TestComponent} ,







  {path:'admin', component: DashComponent},
  {path:'admin/addvoiture', component: AddVoitureComponent},
  {path:'admin/addvoiture', component: AddVoitureComponent},
  {path:'admin/adduser', component: UserListComponent},
  {path:'admin/addbooking', component: BookingAComponent},




];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
