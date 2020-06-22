import { Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';

import { RollbarService } from '../log/rollbar.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptorService {

  constructor(private injector: Injector) { }

  httpErrorHandler(type: any = "error", error: HttpErrorResponse){
    let err = error.name != undefined ? `${error.name}: ${error.message}` : 'Server Error';
    let rollbar = this.injector.get(RollbarService);
    rollbar[type](err); // rollbar logger
    return Observable.throw(err);
  }

  errorHandler(type: any = "error", error: String){
    let rollbar = this.injector.get(RollbarService);
    rollbar[type](error); // rollbar logger
  }
}
