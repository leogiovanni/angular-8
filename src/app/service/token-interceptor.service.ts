import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpErrorResponse,  } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

export const InterceptorSkipHeader = 'X-Skip-Interceptor';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor{

  constructor(private injector: Injector) { }

  intercept(req, next) {

    var tokenizedReq = null;
    if (req.headers.has(InterceptorSkipHeader)) {
      tokenizedReq = req.clone({
        setHeaders: {
          'Content-type': 'application/x-www-form-urlencoded;',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
          'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With',
          'Authorization': 'Basic ' + btoa(environment.client_id+ ':' + environment.client_secret)
        }
      });
    }
    else { 
      let authService = this.injector.get(AuthenticationService);
      tokenizedReq = req.clone({
        setHeaders: {
          'Content-type': 'application/x-www-form-urlencoded;',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
          'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With',
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
