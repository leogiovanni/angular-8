import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor() { }

  authenticate(username, password) {
    if (username != null && password != null) {
      sessionStorage.setItem('username', username)
      return true;
    } 
    else {
      return false;
    }
  }

  isUserLoggedIn() {
    let user = sessionStorage.getItem('username')
    return !(user === null)
  }

  user(){
    return sessionStorage.getItem('username');
  }

  logOut() {
    sessionStorage.removeItem('username')
  }
}