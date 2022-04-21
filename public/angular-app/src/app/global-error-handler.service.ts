import { ErrorPageComponent } from './error-page/error-page.component';
import { Router } from '@angular/router';
import { ErrorHandler, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandlerService implements ErrorHandler{

  constructor(private router:Router) { }
  handleError(error: any): void {
    console.error('An error occured: ',error.message);
    console.error(error);
  }
}
