import { Component, Pipe, PipeTransform } from '@angular/core';
import { HomeComponent, User } from './home.component';

@Pipe({  
    name: 'myfilter',  
    pure: false  
})  
  
export class MyFilterPipe implements PipeTransform {  

    transform(items: any[], filter: User): any {  
        if (!items || !filter || filter.toString().length < 3) {  
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