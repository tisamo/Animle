import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {SimpleResponse} from "../interfaces/simple-response";
import {environment} from "../../../environments/environment";
import {LoginInfos, RegisterInfos, User} from "../interfaces/auth";
import {LeaderBoardItem} from "../interfaces/leader-board";

type Token = {
  token: string;
};

@Injectable()
export class UserService {
  public isAuthenticated: any;
  public userName = '';
  constructor(private http: HttpClient) { }

  getLeaderBoard(type = 'daily'): Observable<LeaderBoardItem[]>{
    return this.http.get<LeaderBoardItem[]>(`${environment.apiUrl}user/leaderboard/${type}`);
  }

  register(registerInfos: RegisterInfos): Observable<Token>{
    return this.http.post<Token>(`${environment.apiUrl}user`,registerInfos);
  }

  isSignedIn(): Observable<SimpleResponse>{
    return this.http.get<SimpleResponse>(`${environment.apiUrl}user/is-signed-in`);
  }
}
