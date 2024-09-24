import {
  HttpInterceptorFn,
} from '@angular/common/http';

export const TokenInterceptor: HttpInterceptorFn = (req, next) =>  {

  const token = localStorage.getItem('jwt');
    if(token){
      req = req.clone({
        setHeaders: {
          Authorization: `${token}`
        }
      });
    }
    return next(req);
}
