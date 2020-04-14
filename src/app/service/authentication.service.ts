import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private router: Router, private http: HttpClient) { }

  saveToken(token) {
    let expireDate = new Date().getTime() + (1000 * token.expires_in);
    sessionStorage.setItem("access_token", token.access_token);
    sessionStorage.setItem("expire_token", expireDate.toString());
  }

  getHeader(){
    return new HttpHeaders()
    .set('Content-type', 'application/x-www-form-urlencoded;')
    .set('Authorization', 'Bearer ' + sessionStorage.getItem("access_token"));
  }
 
  getResource(username, password) : Observable<any> {
    let headers = new HttpHeaders()
      .set('Content-type', 'application/x-www-form-urlencoded;')
      .set('Authorization', 'Basic ' + btoa(environment.client_id+ ':' + environment.client_secret));

    let body = new HttpParams()
      .set('username', username)
      .set('password', password)
      .set('grant_type', 'password');
    
    return this.http.post(environment.doxorder + "oauth/token", body, { headers: headers })
              .catch(this.errorHandler);
  }

  isUserLoggedIn() {
    let token = sessionStorage.getItem('access_token');
    return !(token === null)
  }

  getToken(){
    return { 
      'acess_token': sessionStorage.getItem('access_token'),
      'expire_token': sessionStorage.removeItem('expire_token')
    };
  }

  logOut() {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('expire_token');
    this.router.navigate(['/login'])
  }

  getLoggedUser(){
    let headers = this.getHeader();
    return this.http.get<any>(environment.doxorder+"user/me", { headers: headers })
      .catch(this.errorHandler);    
  }

  errorHandler(error: HttpErrorResponse){
    return Observable.throw(error.message || 'Server Error');
  }
}