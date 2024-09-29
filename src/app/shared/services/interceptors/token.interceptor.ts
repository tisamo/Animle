import {
  HttpErrorResponse,
  HttpInterceptorFn, HttpResponse,
} from '@angular/common/http';
import {catchError, of, tap, throwError} from "rxjs";
import {PopupService} from "../popup.service";
import {inject} from "@angular/core";

// @ts-ignore
export const TokenInterceptor: HttpInterceptorFn = (req, next) =>  {
  let popupService = inject(PopupService);

  const token = localStorage.getItem('jwt');
    if(token){
      req = req.clone({
        setHeaders: {
          Authorization: `${token}`
        }
      });
    }
  return next(req).pipe(
    tap((event)=>{
      if (event instanceof HttpResponse) {
        const message = (event.body as any )?.Response;
        if(message){
          popupService.pushNewMessage(message, 3);
        }
        console.log(event);
      }
    }),
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        localStorage.removeItem('jwt');
      }
      if(error.error.response){
        popupService.pushNewMessage(error.error.response, 3);
      }

      return of(error);
    }))
}
