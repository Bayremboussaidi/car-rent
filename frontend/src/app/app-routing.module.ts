import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Layouts
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';

// User Pages
import { HomeComponent } from './components/pages/home/home.component';
import { AboutComponent } from './components/pages/about/about.component';
import { BlogComponent } from './components/pages/blog/blog.component';
import { BlogDetailsComponent } from './components/blog-details/blog-details.component';
import { ContactComponent } from './components/pages/contact/contact.component';
import { RegisterComponent } from './components/pages/register/register.component';
import { LoginComponent } from './components/pages/login/login.component';
import { ThankYouComponent } from './components/pages/thank-you/thank-you.component';
import { ListcarsComponent } from './components/pages/carlisting/carlisting.component';
import { CarDetailsComponent } from './components/pages/car-details/car-details.component';
//import { NotFoundComponent } from './components/pages/not-found/not-found.component';
import { FooterComponent } from './components/footer/footer.component';
import { TestComponent } from './test/test.component';
import { ReviewsAComponent } from './ADMIN/reviews-a/reviews-a.component';

// Admin Pages
import { DashComponent } from './ADMIN/dash/dash.component';
import { AddVoitureComponent } from './ADMIN/voiture-a/add-voiture.component';
import { UserListComponent } from './ADMIN/users-a/users-a.component';
import { BookingAComponent } from './ADMIN/booking-a/booking-a.component';

// Route Guards (Optional)
//import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  // User Layout
  {
    path: '',
    component: UserLayoutComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'about', component: AboutComponent },
      { path: 'listcars', component: ListcarsComponent },
      { path: 'listcars/:id', component: CarDetailsComponent },
      { path: 'blogs', component: BlogComponent },
      { path: 'blogs/:id', component: BlogDetailsComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'login', component: LoginComponent },
      { path: 'thank-you', component: ThankYouComponent },
      { path: 'footer', component: FooterComponent },
      { path: 'test', component: TestComponent },
    ]
  },

  // Admin Layout
  {
    path: 'admin',
    component: AdminLayoutComponent,
    //canActivate: [AdminGuard], // Protect Admin Routes (Optional)
    children: [
      { path: '', component: DashComponent },
      { path: 'voiturea', component: AddVoitureComponent },
      { path: 'usera', component: UserListComponent },
      { path: 'bookinga', component: BookingAComponent },
      { path: 'reviewa', component: ReviewsAComponent },

    ]
  },

  // Not Found Page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
