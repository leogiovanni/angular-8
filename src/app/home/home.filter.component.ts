import { Component, Pipe, PipeTransform } from '@angular/core';
import { HomeComponent} from './home.component';
import { User } from '../model/user';

@Pipe({  
    name: 'myfilter',  
    pure: false  
})  
  
export class MyFilterPipe implements PipeTransform {  

    transform(items: any[], filter: User): any {  
        if (!items || !filter || filter.toString().length < 2) {  
            return items;  
        }  
        let users = items.filter((item) => {
            var name = item.name.toString().toLowerCase().indexOf(filter.toString().toLowerCase()) !== -1;
            var username = item.username.toString().toLowerCase().indexOf(filter.toString().toLowerCase()) !== -1;
            return name || username;
        });
        return users;
    }  
} 