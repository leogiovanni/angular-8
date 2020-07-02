import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { User } from '../model/user';
import 'rxjs/add/operator/map';
import { environment } from 'src/environments/environment';
import { map, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getUser(): Observable<User[]>{
    return this.http.get<any>(environment.users).pipe(
      delay(1000),
      map((res) => {
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
      })  
    )
  }
  
  getPost(): Observable<any>{
    return this.http.get<any>(environment.posts);   
  }

  getAlbum(): Observable<any>{
    return this.http.get<any>(environment.albums);    
  }

  getPhoto(): Observable<any>{
    return this.http.get<any>(environment.photos);    
  }
}
