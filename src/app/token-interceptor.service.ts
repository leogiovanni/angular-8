import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpErrorResponse,  } from '@angular/common/http';
import { AuthenticationService } from './service/authentication.service';
import { Observable } from 'rxjs/Observable';
import { environment } from '../environments/environment';

export const InterceptorSkipHeader = 'X-Skip-Interceptor';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor{

  constructor(private injector: Injector) { }

  intercept(req, next) {
    if (req.headers.has(InterceptorSkipHeader)) {
      var tokenizedReq = req.clone({
        setHeaders: {
          'Content-type': 'application/x-www-form-urlencoded;',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
          'Authorization': 'Basic ' + btoa(environment.client_id+ ':' + environment.client_secret)
        }
      });
    }
    else { 
      let authService = this.injector.get(AuthenticationService);
      var tokenizedReq = req.clone({
        setHeaders: {
          'Content-type': 'application/x-www-form-urlencoded;',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
          'Authorization': 'Bearer '+ authService.getToken().access_token
        }
      }); 
    }
    return next.handle(tokenizedReq).catch(this.errorHandler);
  }

  errorHandler(error: HttpErrorResponse){
    return Observable.throw(error.message || 'Server Error');
  }
}
