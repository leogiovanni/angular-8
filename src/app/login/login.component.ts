import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username: String = null;
  password: String = null;
  invalidLogin: Boolean = false;
  formLogin: FormGroup;
  isLoading: Boolean = false;
  isLoggedIn: Boolean = false;

  constructor(private router: Router, private authService: AuthenticationService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.formLogin = this.formBuilder.group({
      'username' : [null, [ Validators.email] ],
      'password' : [null, [ Validators.minLength(8)] ]
    });
  }

  login(formLogin:NgForm) {
    this.isLoading = true;

    this.authService.getResource(formLogin["username"], formLogin["password"]).subscribe(
      res => {
        this.authService.saveToken(res);
        this.invalidLogin = false;
        this.isLoading = false;
        this.router.navigate(['']);
      },
      err => {
        this.invalidLogin = true;
        this.isLoading = false;
      }
    );     
  }
}
