import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { environment } from '../../environments/environment';
import { ErrorInterceptorService } from './error/error-interceptor.service';

export const InterceptorSkipHeader = 'X-Skip-Interceptor';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor{

  constructor(private injector: Injector, private errorInterceptor: ErrorInterceptorService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {

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
    return next.handle(tokenizedReq).catch((err) => this.errorInterceptor.httpErrorHandler("error", err));
  }
}
