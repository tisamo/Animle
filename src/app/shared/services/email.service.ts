import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Email} from "../interfaces/Email";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {SimpleResponse} from "../interfaces/simple-response";

@Injectable()
export class EmailService {
  constructor(private httpClient: HttpClient) { }

  sendEmail(email: Email): Observable<SimpleResponse>{
    return this.httpClient.post<SimpleResponse>(`${environment.apiUrl}email/form`, email);
  }
}
