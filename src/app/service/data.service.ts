import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getUser(url: string){
    return this.http.get<any>(url);    
  }

  getPost(url: string){
    return this.http.get<any>(url);    
  }

  getAlbum(url: string){
    return this.http.get<any>(url);    
  }

  getPhoto(url: string){
    return this.http.get<any>(url);    
  }
}
