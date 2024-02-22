import {Component, Input, OnDestroy} from '@angular/core';
import {borderAnim, opacity, slipLeft} from "../../../animations/animations";
import {PopupService} from "../../../services/popup.service";
import {NgForOf} from "@angular/common";


@Component({
  selector: 'app-message',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
  animations: [slipLeft, borderAnim]
})
export class MessageComponent{
  interval: any ;
  counter = 0;
  constructor(public popupService: PopupService){
    this.interval = setInterval(()=>{
      this.counter++;
      this.popupService.messages.forEach((m)=>
        {
          m.time--;
          if(m.time <=0) {
            this.popupService.messages.shift();
          }
        }
      )
      if(popupService.messages.length ===0){
        clearInterval(this.interval);
      }
    }, 1000);
  }


}
