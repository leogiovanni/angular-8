import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute } from "@angular/router";
import { Router } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DataService } from '../service/data.service';
import { User } from '../model/user';
import { ErrorInterceptorService } from '../service/error/error-interceptor.service';
import { Observable } from 'rxjs/Observable';
import { SubSink } from 'subsink';
import { forkJoin } from 'rxjs';

const CACHE_KEY = "userCached";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit, OnDestroy {

  users: User[];
  success: boolean = false;
  successRemove: boolean = false;
  error: boolean = false;
  isLoadingResults: boolean = false;
  message: string;
  form: FormGroup;
  formNew: FormGroup;
  search: string;

  // new User
  id: number = null;
  username: string = null;
  name: string = null;
  email: string = null;
  city: string = null;
  frequency: string = null;
  day: Array<String> = null;
  daySun: boolean = null;
  dayMon: boolean = null;
  dayTue: boolean = null;
  dayWed: boolean = null;
  dayThu: boolean = null;
  dayFri: boolean = null;
  daySat: boolean = null;

  subs = new SubSink();

  constructor(private data: DataService, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, public confirm: MatDialog, private errorInterceptor: ErrorInterceptorService) {  }

  ngOnInit() {    
    this.onLoadPage();   
  }

  onLoadPage(){
    
    console.log("Teste rollbar");
    this.errorInterceptor.errorHandler("debug", "Teste rollbar");

    this.isLoadingResults = true;

    this.form = this.formBuilder.group({
      'search' : [null, [ Validators.minLength(2)] ]
    });

    this.formNew = this.formBuilder.group({
      'username' : [null, [ Validators.required, Validators.minLength(3)] ],
      'name' : [null, [ Validators.required, Validators.minLength(2)] ],
      'email' : [null, [ Validators.required, Validators.email] ],
      'frequency' : [null, [ Validators.required ] ],
      'day' : this.formBuilder.group({
        "daySun" : [null],
        "dayMon" : [null],
        "dayTue" : [null],
        "dayWed" : [null],
        "dayThu" : [null],
        "dayFri" : [null],
        "daySat" : [null]
      }),
      'city': [null],            
    });

    /**
     * could remove the subscribe
     * creating users as an observable - users: Observable<User[]>; -- observable that emits User type
     * and use pipe async in the view - users | async
     */
    // this.subs.sink = this.data.getUser()
    //   .pipe(
    //     startWith(JSON.parse(sessionStorage[CACHE_KEY] || '[]')) // data stored used to load the firts time 
    //   )
    //   .subscribe(
    //     res => {
    //       this.users = res;
    //       this.isLoadingResults = false;
    //       sessionStorage[CACHE_KEY] = JSON.stringify(this.users);
    //       if(this.users.length > 0 && this.users[0] instanceof User) {
    //         this.searchPosts();
    //         this.searchAlbums();
    //       }
    //     },
    //     err => this.errorMethod(err)
    // );

    let users  = this.data.getUser();
    let posts  = this.data.getPost();
    let albums = this.data.getAlbum();
    let photos = this.data.getPhoto();

    this.subs.sink = forkJoin([users, posts, albums, photos])
      .subscribe(
        res => {

          this.users = res[0];
          this.isLoadingResults = false;

          res[1].forEach(post => this.calculate(post, "posts"));

          res[2].forEach(album => {
            // fill albums quantity
            this.calculate(album, "albums");

            // fill photos based on albums
            res[3].forEach(photo => {
              if(album.id == photo.albumId){
                this.calculate(album, "photos");
              }
            });
          });
        },
        err => this.errorMethod(err)
    );    
  }

  searchPosts(){
    this.subs.sink = this.data.getPost().subscribe(posts => {
      for(let post of posts){
        this.calculate(post, "posts");
      }    
    });     
  }

  searchAlbums(){

    let albums = this.data.getAlbum();
    let photos = this.data.getPhoto();

    this.subs.sink = forkJoin([albums, photos]).subscribe(res => {
      for(let album of res[0]){
            
        // fill albums quantity
        this.calculate(album, "albums");

        // fill photos based on albums
        for(let photo of res[1]){
          if(album.id == photo.albumId){
            this.calculate(album, "photos");
          }
        }
      }
    });        
  }

  calculate(item: any, type: string) {
    let index = this.users.findIndex(User => User.id === item.userId);
    this.users[index][type] = this.users[index][type] + 1;
  }

  deleteUser(id: number){
    const dialogRef = this.confirm.open(HomeConfirmComponent, {
      data : {'text': 'Are you sure ?'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === true){
        let index = this.users.findIndex(User => User.id === id);
        this.users.splice(index, 1);
        let message = "User removed successfully";
        this.successRemoveMethod(message);
      }
    });
  }

  addNewUser(formNew:NgForm, formDirective: FormGroupDirective) {

    this.id = this.users.reduce((max, p) => p.id > max ? p.id : max, this.users[0].id) + 1;

    let days = "";

    if(formNew["day"]["daySun"]== true) days = days + "Sun";
    if(formNew["day"]["dayMon"]== true) days = days + this.addComa(days) + "Mon";
    if(formNew["day"]["dayTue"]== true) days = days + this.addComa(days) + "Tue";    
    if(formNew["day"]["dayWed"]== true) days = days + this.addComa(days) + "Wed";
    if(formNew["day"]["dayThu"]== true) days = days + this.addComa(days) + "Thu";
    if(formNew["day"]["dayFri"]== true) days = days + this.addComa(days) + "Fri";
    if(formNew["day"]["daySat"]== true) days = days + this.addComa(days) + "Sat";

    this.users.push(new User(
        this.id, 
        formNew['username'], 
        formNew['name'], 
        formNew['email'],
        formNew['city'],
        formNew['frequency'],
        days,
        0,
        0,
        0
      )
    );

    this.formNew.reset();
    formDirective.resetForm();
    let message = "User added successfully";
    this.successMethod(message);
  }

  addComa(day: string){
    if(day != "") return ", ";
    return "";
  }

  showRemoveBtn(show: boolean, id: string){
    if(show){
      document.getElementById(id).style.display = "block";
    }
    else {
      document.getElementById(id).style.display = "none";
    }
  }

  onInputChange(form:NgForm) {
    this.search = form['search'];
  }

  successMethod(message){
    this.success = true;
    this.error = false;
    this.message = message;

    setTimeout(() => {
      this.success = false;      
    }, 4000);
  }

  successRemoveMethod(message){
    this.successRemove = true;
    this.message = message;

    setTimeout(() => {
      this.successRemove = false;      
    }, 4000);
  }

  errorMethod(message: string){
    this.message = message;
    this.isLoadingResults = false;
    this.success = false;
    this.error = true;

    setTimeout(() => {
      this.error = false;      
    }, 4000);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
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