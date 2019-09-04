import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthGaurdService } from './service/auth-gaurd.service';

const routes: Routes = [
  //{ path: '',       component: HomeComponent, canActivate:[AuthGaurdService] },
  { path: '',       component: HomeComponent },
  { path: 'login',  component: LoginComponent },
  { path: 'logout', component: LogoutComponent, canActivate:[AuthGaurdService] },
  { path: "**",     component: PageNotFoundComponent}, //wildcard 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
