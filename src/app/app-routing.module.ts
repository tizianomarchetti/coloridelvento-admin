import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './component/home/home.component';


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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
