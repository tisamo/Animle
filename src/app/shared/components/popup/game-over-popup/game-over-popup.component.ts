import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgIf} from "@angular/common";
import {opacity} from "../../../animations/animations";

@Component({
  selector: 'app-game-over-popup',
  standalone: true,
  imports: [
    NgIf
  ],
  animations:[opacity],
  templateUrl: './game-over-popup.component.html',
  styleUrl: './game-over-popup.component.scss'
})
export class GameOverPopupComponent {
  @Output() action = new EventEmitter();
  @Input() winText: string = '';
  @Input() result: number  = 0;

  emitAction(eventTrigger: string){
    this.action.emit(eventTrigger);
  }
}
