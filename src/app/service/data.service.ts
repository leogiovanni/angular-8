import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getUser(url: string): Observable<any>{
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
