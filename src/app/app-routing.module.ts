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
import { BandComponent } from './component/band/band.component';
import { ComponentComponent } from './component/component/component.component';
import { ComponentsComponent } from './component/components/components.component';
import { PhotosComponent } from './component/photos/photos.component';
import { PhotoComponent } from './component/photo/photo.component';
import { VideosComponent } from './component/videos/videos.component';
import { VideoComponent } from './component/video/video.component';
import { ContactsComponent } from './component/contacts/contacts.component';
import { ContactComponent } from './component/contact/contact.component';
import { FormContattoComponent } from './component/form-contatto/form-contatto.component';
import { QuizComponent } from './component/quiz/quiz.component';


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
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard]
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
  {
    path: "band",
    canActivateChild: [AuthGuard],
    children: [
      {
        path: "",
        component: BandComponent,
        canDeactivate: [CanDeactivateGuard]
      }
    ]
  },
  {
    path: "components",
    canActivateChild: [AuthGuard],
    children: [
      {
        path: "",
        component: ComponentsComponent
      },
      {
        path: "insert",
        component: ComponentComponent,
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: ":id",
        component: ComponentComponent,
        canDeactivate: [CanDeactivateGuard]
      }
    ]
  },
  {
    path: "photos",
    canActivateChild: [AuthGuard],
    children: [
      {
        path: "",
        component: PhotosComponent
      },
      {
        path: "insert",
        component: PhotoComponent,
        canDeactivate: [CanDeactivateGuard]
      }
    ]
  },
  {
    path: "videos",
    canActivateChild: [AuthGuard],
    children: [
      {
        path: "",
        component: VideosComponent
      },
      {
        path: "insert",
        component: VideoComponent,
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: ":id",
        component: VideoComponent,
        canDeactivate: [CanDeactivateGuard]
      }
    ]
  },
  {
    path: "contacts",
    canActivateChild: [AuthGuard],
    children: [
      {
        path: "",
        component: ContactsComponent
      },
      {
        path: "insert",
        component: ContactComponent,
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: ":id",
        component: ContactComponent,
        canDeactivate: [CanDeactivateGuard]
      }
    ]
  },
  {
    path: "footer-contacts",
    canActivateChild: [AuthGuard],
    children: [
      {
        path: "",
        component: ContactsComponent
      },
      {
        path: "insert",
        component: ContactComponent,
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: ":id",
        component: ContactComponent,
        canDeactivate: [CanDeactivateGuard]
      }
    ]
  },
  {
    path: "contact-form",
    canActivateChild: [AuthGuard],
    children: [
      {
        path: "",
        component: FormContattoComponent,
        canDeactivate: [CanDeactivateGuard]
      }
    ]
  },
  {
    path: "quiz",
    canActivateChild: [AuthGuard],
    children: [
      {
        path: "",
        component: QuizComponent,
        canDeactivate: [CanDeactivateGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
