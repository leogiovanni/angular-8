import { Component, OnInit, Inject } from '@angular/core';
import { DataService } from '../data.service';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute } from "@angular/router";
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit {

  users: Array<User> = [];
  success: boolean = false;
  error: boolean = false;
  isLoadingResults: boolean = false;
  message: string = null;
  form: FormGroup;
  formNew: FormGroup;
  search: string = null;

  // new User
  id: number = null;
  username: string = null;
  name: string = null;
  email: string = null;
  city: string = null;
  frequency: string = null;
  day: Array<String> = null;

  constructor(private data: DataService, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, public confirm: MatDialog) {  }

  ngOnInit() {    
    this.onLoadPage();   
  }

  onLoadPage(){
    this.isLoadingResults = true;

    this.form = this.formBuilder.group({
      'search' : [null, [ Validators.minLength(2)] ]
    });

    this.formNew = this.formBuilder.group({
      'username' : [null, [ Validators.required, Validators.minLength(3)] ],
      'name' : [null, [ Validators.required, Validators.minLength(2)] ],
      'email' : [null, [ Validators.required, Validators.email] ],
      'frequency' : [null, [ Validators.required ] ],
      'day' : [null, [ Validators.required ] ],
      'city': [null]
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

        if(this.users.length > 0){
          this.searchPosts();
          this.searchAlbuns();
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

  searchAlbuns(){
    this.data.get(environment.albums).subscribe(
      res=>{

        let albums = res;
        
        this.data.get(environment.photos).subscribe(
          res=>{
            for(let album of albums){
              
              // fill albums quantity
              let indexAlbum = this.users.findIndex(User => User.id === album.userId);
              this.users[indexAlbum].albums = this.users[indexAlbum].albums + 1;
              
              //fill photos based on albums
              for(let photo of res){
                let albumId = photo.albumId;

                if(album.id == albumId && album.userId == this.users[indexAlbum].id){
                  let indexPhoto = this.users.findIndex(User => User.id === album.userId);
                  this.users[indexPhoto].photos = this.users[indexPhoto].photos + 1;
                }
              }
            }
          }
        );
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

  addNewUser(formNew:NgForm) {
    this.id = this.users.reduce((max, p) => p.id > max ? p.id : max, this.users[0].id) + 1;
   
    // console.log(formNew['day']);

    this.users.push(new User(
        this.id, 
        formNew['username'], 
        formNew['name'], 
        formNew['email'],
        formNew['city'],
        formNew['frequency'],
        "",
        0,
        0,
        0
      )
    );

    let message = "User added successfully";
    this.successMethod(message);
  }

  showRemoveBtn(show: boolean, id: string){
    if(show){
      document.getElementById(id).style.display = "block";
    }
    else {
      document.getElementById(id).style.display = "none";
    }
  }

  successMethod(message){
    this.success = true;
    this.error = false;
    this.message = message;

    setTimeout(() => {
      this.success = false;      
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
}

export class User {
  public id: number;
  public username: string;
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