import { Component, OnInit, Inject, Pipe, PipeTransform} from '@angular/core';
import { DataService } from '../data.service';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { validateHorizontalPosition, CloseScrollStrategy } from '@angular/cdk/overlay';
import { ActivatedRoute } from "@angular/router";
import { switchMap, first } from "rxjs/operators";
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { $ } from 'protractor';
import { MyFilterPipe } from './home.filter.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit {

  users: Array<User> = [];
  success: boolean = false;
  warning: boolean = false;
  error: boolean = false;
  isLoadingResults: boolean = false;
  message: string = null;
  form: FormGroup;
  search: string = null;

  constructor(private data: DataService, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, public confirm: MatDialog) {  }

  ngOnInit() {    
    this.onLoadPage();   
  }

  onLoadPage(){
    this.isLoadingResults = true;

    this.form = this.formBuilder.group({
      'search' : [null, [ Validators.minLength(3)] ]
    });

    this.data.get(environment.users).subscribe(
      res=>{

        for(let user of res){
          this.users.push(new User(
              user.id, 
              user.username, 
              user.name, 
              user.email,
              user.address.city,
              this.rideInGroup(),
              this.dayOfweek(),
              0,
              0,
              0
            )
          );
        };

        this.isLoadingResults = false;

        if(this.users.length < 1){
          this.users = null;
        }  
        else {
          this.searchPosts();
          this.searchAlbuns();
          this.searchPhotos();
        }
      },
      err =>{
        let message = "Request failed";
        this.errorMethod(message);
      }
    );    
  }

  onInputChange(form:NgForm) {
    this.search = form['search'];
  }

  searchPosts(){
    this.data.get(environment.posts).subscribe(
      res=>{
        for(let post of res){
          let index = this.users.findIndex(User => User.id === post.userId);
          this.users[index].posts = this.users[index].posts + 1;
        }    
      }
    );     
  }

  searchPhotos(){
    this.data.get(environment.photos).subscribe(
      res=>{
        
      }
    );
  }

  searchAlbuns(){
    this.data.get(environment.albums).subscribe(
      res=>{
        for(let album of res){
          let index = this.users.findIndex(User => User.id === album.userId);
          this.users[index].albums = this.users[index].albums + 1;
        }  
      }
    );
  }
  
  rideInGroup(){
    let array =  ['Always', 'Sometimes', 'Never'];
    return array[Math.floor(Math.random()*array.length)];
  }

  dayOfweek(){
    let array =  ['Monday','Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return array[Math.floor(Math.random()*array.length)]
  }

  deleteUser(id: number){
    const dialogRef = this.confirm.open(HomeConfirmComponent, {
      data : {'text': 'Are you sure ?'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === true){
        let index = this.users.findIndex(User => User.id === id);
        this.users.splice(index, 1);
      }
    });
  }

  showRemoveBtn(show: boolean, id: string){
    if(show){
      document.getElementById(id).style.display = "block";
    }
    else {
      document.getElementById(id).style.display = "none";
    }
  }

  reset(){
    this.users = [];
    this.success = false;
    this.warning = false;
    this.error = false;
    this.isLoadingResults = false;
  }

  successMethod(){
    this.success = true;
    this.warning = false;
    this.error = false;
    this.isLoadingResults = false;
  }

  errorMethod(message: string){
    this.message = message;
    this.isLoadingResults = false;
    this.success = false;
    this.warning = false;
    this.error = true;
  }

  warningMethod(message: string){
    this.message = message;
    this.isLoadingResults = false;
    this.success = false;
    this.warning = true;
    this.error = false;
  }
}

export class User {
  public id: number;
  private username: string;
  public name: string;
  private email: string;
  private city: string;
  private rideInGroup: string;
  private dayOfWeek: string;
  public posts: number;
  public albums: number;
  public photos: number;
  constructor(id:number,username:string,name:string,email: string,city:string,rideInGroup:string,dayOfWeek:string,posts:number,albums:number,photos:number) { 
    this.id = id; 
    this.username = username;
    this.name = name;
    this.email = email;
    this.city = city;
    this.rideInGroup = rideInGroup;
    this.dayOfWeek = dayOfWeek;
    this.posts = posts;
    this.albums = albums;
    this.photos = photos; 
  }
}

@Component({
  selector: 'app-home-confirm',
  templateUrl: './home.confirm.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeConfirmComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
};