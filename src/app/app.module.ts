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
import { MatFormFieldModule, MatInputModule, MatTableModule, MatPaginatorModule, MatSortModule, MatDialogModule, MatCheckboxModule } from '@angular/material';
import { EventComponent } from './component/event/event.component';
import { ModaleComponent } from './component/modale/modale.component';
import { LoginComponent } from './component/login/login.component';
import { AuthInterceptor } from './interceptor/app.interceptor';
import { ProfileComponent } from './component/profile/profile.component';
import { AcceptComponent } from './component/accept/accept.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    EventsComponent,
    EventComponent,
    ModaleComponent,
    LoginComponent,
    ProfileComponent,
    AcceptComponent
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
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgHttpLoaderModule.forRoot()
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  entryComponents: [ModaleComponent]
})
export class AppModule { }
