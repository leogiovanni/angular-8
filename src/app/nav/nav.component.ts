import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../service/authentication.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  constructor(public authService:AuthenticationService) { }

  loggedUser: String = null;

  ngOnInit() {
    this.authService.getLoggedUser().subscribe(
      res => {
        this.loggedUser = res.name;
      },
      err => {}
    );
  }
}
