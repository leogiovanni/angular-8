import { Component, OnInit, Inject} from '@angular/core';
import { DataService } from '../data.service';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { validateHorizontalPosition, CloseScrollStrategy } from '@angular/cdk/overlay';
import { ActivatedRoute } from "@angular/router";
import { switchMap, first } from "rxjs/operators";
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';

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

  constructor(private data: DataService, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, public confirm: MatDialog) {  }

  ngOnInit() {    
    this.onLoadPage();   
  }

  onLoadPage(){
    this.isLoadingResults = true;
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
              this.searchPosts(user.id),
              this.searchAlbuns(user.id),
              this.searchPhotos(user.id)
            )
          );
        };

        if(this.users.length < 1){
          this.users = null;
        }  
      },
      err =>{
        let message = "Request failed";
        this.errorMethod(message);
      }
    );    
  }

  searchPosts(id: number){
    var qtd = 0;
    this.data.get(environment.posts+"?userId="+id).subscribe(
      res=>{
        qtd =  res.length;
        return qtd;
      }
    );
    return qtd;     
  }

  searchPhotos(id: number){
    var qtd = 0;
    this.data.get(environment.photos+"?userId="+id).subscribe(
      res=>{
        qtd =  res.length;
      }
    );
    return qtd;    
  }

  searchAlbuns(id: number){
    var qtd = 0;
    this.data.get(environment.albums+"?userId="+id).subscribe(
      res=>{
        qtd =  res.length;
      }
    );
    return qtd;    
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

@Component({
  selector: 'app-home-confirm',
  templateUrl: './home.confirm.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeConfirmComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
};

export class User {
  public id: number;
  private username: string;
  private name: string;
  private email: string;
  private city: string;
  private rideInGroup: string;
  private dayOfWeek: string;
  private posts: number;
  private albums: number;
  private photos: number;
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