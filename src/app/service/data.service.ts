import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { User } from '../model/user';
import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getUser(url: string): Observable<User[]>{
    return this.http.get<any>(url)
      .map((res: any) => {
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
  
  getPost(url: string): Observable<any>{
    return this.http.get<any>(url);   
  }

  getAlbum(url: string): Observable<any>{
    return this.http.get<any>(url);    
  }

  getPhoto(url: string): Observable<any>{
    return this.http.get<any>(url);    
  }
}
