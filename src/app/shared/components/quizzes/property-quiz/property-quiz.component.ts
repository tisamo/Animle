import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {NgForOf} from "@angular/common";
import {Words} from "../../../interfaces/words.inteface";

@Component({
  selector: 'app-property-quiz',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './property-quiz.component.html',
  styleUrl: './property-quiz.component.scss'
})
export class PropertyQuizComponent implements OnChanges, OnInit{
  @Input() words: Words[] = [];

  @Input() time = 0;
  stopped = false;
  stop = 0;
  usedNumbers: number[] = [];

  ngOnInit(): void {
    this.initGame();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.time === 0 )return;
    if(this.time ===1 ){
      this.words = this.words.map((r)=>{
        return{
          ...r ,
          shown: false
        }
      })
      this.initGame();
      this.showWordAtIndex();
      return;
    }
  }
  initGame(){

  }
  showWordAtIndex(){
  }
}
