import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {SimpleResponse} from "../interfaces/simple-response";
import {environment} from "../../../environments/environment";
import {LoginInfos, RegisterInfos} from "../interfaces/auth";
import { getFingerprint } from '@thumbmarkjs/thumbmarkjs'

type Token = {
  token: string;
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isAuthenticated: any;
  public userName = '';
  public fingerPrintOfDevice = '';
  constructor(private http: HttpClient) {
    getFingerprint(true).then((print)=>{
      this.fingerPrintOfDevice = print.hash;
    });
  }

  getFingerPrint(){

  }
  login(loginInfos: LoginInfos): Observable<Token>{
    return this.http.post<Token>(`${environment.apiUrl}user/login`,loginInfos);
  }

  register(registerInfos: RegisterInfos): Observable<Token>{
    return this.http.post<Token>(`${environment.apiUrl}user`,registerInfos);
  }

  isSignedIn(): Observable<SimpleResponse>{
    return this.http.get<SimpleResponse>(`${environment.apiUrl}user/is-signed-in`);
  }
}
