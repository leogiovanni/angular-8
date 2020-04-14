import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Router } from '@angular/router';
import { InterceptorSkipHeader } from '../token-interceptor.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private router: Router, private http: HttpClient) { }

  logIn(username, password) : Observable<any> {
    let headers = new HttpHeaders().set(InterceptorSkipHeader, 'X-Skip-Interceptor');
    let body = new HttpParams()
      .set('username', username)
      .set('password', password)
      .set('grant_type', 'password');
    return this.http.post(environment.doxorder + "oauth/token", body, { headers: headers });
  }

  saveToken(token) {
    let expireDate = new Date().getTime() + (1000 * token.expires_in);
    sessionStorage.setItem("access_token", token.access_token);
    sessionStorage.setItem("expire_token", expireDate.toString());
  }

  isUserLoggedIn() {
    let token = sessionStorage.getItem('access_token');
    return !(token === null)
  }

  getToken(){
    return { 
      'access_token': sessionStorage.getItem('access_token'),
      'expire_token': sessionStorage.removeItem('expire_token')
    };
  }

  logOut() {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('expire_token');
    sessionStorage.removeItem('logged_user');
    this.router.navigate(['/login'])
  }

  getLoggedUser(){
    return this.http.get<any>(environment.doxorder+"user/me");  
  }

  loggedUser(){
    return sessionStorage.getItem('logged_user')
  }
}