import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './component/home/home.component';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EventsComponent } from './component/events/events.component';
import { MatFormFieldModule, MatInputModule, MatTableModule, MatPaginatorModule, MatSortModule, MatDialogModule, MatCheckboxModule, MatSelectModule, MatOptionModule } from '@angular/material';
import { EventComponent } from './component/event/event.component';
import { ModaleComponent } from './component/modale/modale.component';
import { LoginComponent } from './component/login/login.component';
import { AuthInterceptor } from './interceptor/app.interceptor';
import { ProfileComponent } from './component/profile/profile.component';
import { AcceptComponent } from './component/accept/accept.component';
import { BandComponent } from './component/band/band.component';
import { ComponentComponent } from './component/component/component.component';
import { ComponentsComponent } from './component/components/components.component';
import { QuillModule, QuillService } from 'ngx-quill';
import { PhotosComponent } from './component/photos/photos.component';
import { VideosComponent } from './component/videos/videos.component';
import { PhotoComponent } from './component/photo/photo.component';
import { VideoComponent } from './component/video/video.component';
import { ContactsComponent } from './component/contacts/contacts.component';
import { ContactComponent } from './component/contact/contact.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    EventsComponent,
    EventComponent,
    ModaleComponent,
    LoginComponent,
    ProfileComponent,
    AcceptComponent,
    BandComponent,
    ComponentComponent,
    ComponentsComponent,
    PhotosComponent,
    VideosComponent,
    PhotoComponent,
    VideoComponent,
    ContactsComponent,
    ContactComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatDialogModule,
    MatCheckboxModule,
    MatSelectModule,
    MatOptionModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgHttpLoaderModule.forRoot(),
    QuillModule.forRoot({
      theme: 'snow', // Set default theme
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline'], // Formatting options
          [{ list: 'ordered' }, { list: 'bullet' }], // Lists
          ['link'], // Media links
        ],
      },
    })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    QuillService
  ],
  bootstrap: [AppComponent],
  entryComponents: [ModaleComponent]
})
export class AppModule { }
