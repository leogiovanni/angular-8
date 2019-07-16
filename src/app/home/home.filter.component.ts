import { Component, Pipe, PipeTransform } from '@angular/core';
import { HomeComponent, User } from './home.component';

@Pipe({  
    name: 'myfilter',  
    pure: false  
})  
  
export class MyFilterPipe implements PipeTransform {  
    
    transform(items: any[], filter: User): any {  
        if (!items || !filter) {  
            return items;  
        }  
        return items.filter(item => item.name.indexOf(filter) !== -1) 
    }  
} 