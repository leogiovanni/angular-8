import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { User } from '../model/user';
import 'rxjs/add/operator/map';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getUser(): Observable<User[]>{
    return this.http.get<any>(environment.users)
      .map((res) => {
        let result = res.map((item) => {
          return new User(
            item.id, 
            item.username, 
            item.name, 
            item.email,
            item.address.street,
            User.getRideInGroup(),
            User.getDayOfweek(),
            0,
            0,
            0
          );
        });
        return result;
    });    
  }
  
  getPost(){
    return this.http.get<any>(environment.posts);   
  }

  getAlbum(){
    return this.http.get<any>(environment.albums);    
  }

  getPhoto(){
    return this.http.get<any>(environment.photos);    
  }
}
