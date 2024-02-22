import { Injectable } from '@angular/core';
import {Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree} from '@angular/router';
import {CanActivate} from "@angular/router";
import {AuthService} from "../auth.service";
import {catchError, map, Observable, of} from "rxjs";
import {SimpleResponse} from "../../interfaces/simple-response";
import {PopupService} from "../popup.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService,
              private popupService: PopupService,
              private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean > | UrlTree {
    return this.authService.isSignedIn().pipe(map(()=>{
        return true;
    }),  catchError((err) => {
      this.router.createUrlTree(['auth/login']);
      return of(false);
    }));
  }
}
