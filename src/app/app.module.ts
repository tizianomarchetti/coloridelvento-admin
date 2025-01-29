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
import { FormContattoComponent } from './component/form-contatto/form-contatto.component';
import { QuizComponent } from './component/quiz/quiz.component';
import { ResultsComponent } from './component/results/results.component';
import { ResultComponent } from './component/result/result.component';
import { QuestionsComponent } from './component/questions/questions.component';
import { QuestionComponent } from './component/question/question.component';
import { AnswerComponent } from './component/answer/answer.component';
import { SingleImageComponent } from './component/single-image/single-image.component';
import { SocialsComponent } from './component/socials/socials.component';
import { SocialComponent } from './component/social/social.component';
import { TitlesComponent } from './component/titles/titles.component';
import { AboutTitlesComponent } from './component/about-titles/about-titles.component';
import { MediaTitlesComponent } from './component/media-titles/media-titles.component';
import { ContactTitlesComponent } from './component/contact-titles/contact-titles.component';
import { QuizTitlesComponent } from './component/quiz-titles/quiz-titles.component';
import { ColorsComponent } from './component/colors/colors.component';

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
    ContactComponent,
    FormContattoComponent,
    QuizComponent,
    ResultsComponent,
    ResultComponent,
    QuestionsComponent,
    QuestionComponent,
    AnswerComponent,
    SingleImageComponent,
    SocialsComponent,
    SocialComponent,
    TitlesComponent,
    AboutTitlesComponent,
    MediaTitlesComponent,
    ContactTitlesComponent,
    QuizTitlesComponent,
    ColorsComponent
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
