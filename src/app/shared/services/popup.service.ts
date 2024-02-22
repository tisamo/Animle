import { Injectable } from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
interface PopupMessage{
  time: number;
  message: string;
}
@Injectable({
  providedIn: 'root'
})
export class PopupService {
  messages:PopupMessage[] = [];

  pushNewMessage(message: string, time: number){
    if(this.messages.length ==5) return;
    this.messages.push({message: message,time });
  }

  pushErrorMessage(err: HttpErrorResponse){
    if(this.messages.length ==5) return;
    this.messages.push({message: err.error.response, time: 3});
  }

}
