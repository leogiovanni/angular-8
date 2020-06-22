import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatInputModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule,
  MatIconModule,
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatExpansionModule,
  MatRadioModule,
  MatCheckboxModule,
 } from "@angular/material";
 import { AngularFontAwesomeModule } from 'angular-font-awesome';
 
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AlertModule } from 'ngx-bootstrap';
import { ButtonsModule } from 'ngx-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { HomeComponent, HomeConfirmComponent} from './home/home.component';
import { MyFilterPipe } from './home/home.filter.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { TokenInterceptorService } from './service/token-interceptor.service';
import { RollbarErrorHandler, RollbarService, rollbarFactory } from './service/log/rollbar.service';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    HomeConfirmComponent,
    MyFilterPipe,
    LoginComponent,
    LogoutComponent,
    PageNotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatRadioModule,
    MatCheckboxModule,
    MatDialogModule,
    AngularFontAwesomeModule,
    AlertModule.forRoot(),
    ButtonsModule.forRoot()
  ],
  entryComponents: [
    HomeConfirmComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },
    {
      provide: ErrorHandler, 
      useClass: RollbarErrorHandler
    },
    {
      provide: RollbarService,
      useFactory: rollbarFactory
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
