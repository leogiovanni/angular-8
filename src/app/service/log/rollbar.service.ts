import * as Rollbar from 'rollbar';
import { Injectable, Inject, InjectionToken, ErrorHandler } from '@angular/core';
import { environment } from 'src/environments/environment';

const rollbarConfig = {
  accessToken: environment.rollbar_token,
  captureUncaught: environment.capture_uncaught,
  captureUnhandledRejections: environment.capture_unhandled_rejections,
};

export const RollbarService = new InjectionToken<Rollbar>('rollbar');

@Injectable({
  providedIn: 'root'
})
export class RollbarErrorHandler implements ErrorHandler {
  constructor(@Inject(RollbarService) private rollbar: Rollbar) {}
  handleError(err: any) : void {
    this.rollbar.error(err.message || err);
  }
}

export function rollbarFactory() {
  return new Rollbar(rollbarConfig);
}