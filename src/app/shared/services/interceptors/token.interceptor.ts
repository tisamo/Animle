import {
  HttpInterceptorFn,
} from '@angular/common/http';

export const TokenInterceptor: HttpInterceptorFn = (req, next) =>  {
    // You can manipulate the outgoing request here
    // For example, adding headers, logging, etc.
  const token = localStorage.getItem('jwt');
    if(token){
      req = req.clone({
        setHeaders: {
          Authorization: token
        }
      });
    }
    // Pass the modified request on to the next handler
    return next(req);

}
