import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { EventsComponent } from './component/events/events.component';
import { EventComponent } from './component/event/event.component';
import { CanDeactivateGuard } from './guard/can-deactivate.guard';
import { LoginComponent } from './component/login/login.component';
import { LoginGuard } from './guard/login.guard';
import { AuthGuard } from './guard/auth.guard';
import { ProfileComponent } from './component/profile/profile.component';
import { AcceptComponent } from './component/accept/accept.component';
import { AdminGuard } from './guard/admin.guard';


const routes: Routes = [
  {
    /**
     * La radice della single page application è stabilita al componente HomeComponent
     */
    path: "",
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "login",
    component: LoginComponent,
    canActivate: [LoginGuard]
  },
  {
    path: "register",
    component: LoginComponent,
    canActivate: [LoginGuard]
  },
  {
    path: "acceptRegistration/:id",
    component: AcceptComponent,
    canActivate: [AdminGuard]
  },
  {
    path: "profile",
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "events",
    canActivateChild: [AuthGuard],
    children: [
      {
        path: "",
        component: EventsComponent
      },
      {
        path: "insert",
        component: EventComponent,
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: ":id",
        component: EventComponent,
        canDeactivate: [CanDeactivateGuard]
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
