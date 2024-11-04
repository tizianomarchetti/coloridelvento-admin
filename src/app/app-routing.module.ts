import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { EventsComponent } from './component/events/events.component';
import { EventComponent } from './component/event/event.component';
import { CanDeactivateGuard } from './guard/can-deactivate.guard';


const routes: Routes = [
  {
    path: "home",
    redirectTo: "",
    pathMatch: "full"
  },
  {
    /**
     * La radice della single page application è stabilita al componente HomeComponent
     */
    path: "",
    component: HomeComponent,
  },
  {
    path: "events",
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
