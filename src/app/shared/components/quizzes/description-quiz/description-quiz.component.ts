import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {EmojiQuizComponent} from "../emoji-quiz/emoji-quiz.component";
import {NgForOf, NgIf} from "@angular/common";
import {fadeInOutAnimation} from "../../../animations/animations";
import {Words} from "../../../interfaces/words.inteface";



@Component({
  selector: 'app-description-quiz',
  standalone: true,
  imports: [
    EmojiQuizComponent,
    NgIf,
    NgForOf
  ],
  templateUrl: './description-quiz.component.html',
  styleUrl: './description-quiz.component.scss',
  animations: [fadeInOutAnimation]
})
export class DescriptionQuizComponent implements OnChanges, OnInit {
  @Input() words: Words[] = [];
  showIndex = 0;
  showIndex2 = 0;
  showIndex3 = 0;
  showIndex4 = 0;
  randomIndex = 0;
  randomIndex2 = 0;
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
    if(this.showIndex === this.stop){
      this.words = this.words.map((r)=>{
        return{
          ...r ,
          shown: true
        }
      })

      return;
    }
    this.showWordAtIndex();
  }
   initGame(){
     this.showIndex = 0;
     this.showIndex4 = this.words.length - 1;
     this.showIndex3 = Math.round(this.words.length  - (this.words.length - 1) / 2);
     this.showIndex2 = Math.round((this.words.length - 1) / 2);
     this.stop = Math.round((this.words.length -1) /4);
   }
   showWordAtIndex(){
     this.randomIndex = Math.floor(Math.random() * (this.words.length -1));
     this.randomIndex2 = Math.floor(Math.random() * (this.words.length -2));
     this.words[this.showIndex].shown = true;
     this.words[this.showIndex2].shown = true;
     this.words[this.showIndex3].shown = true;
     this.words[this.showIndex4].shown = true;
     this.words[this.randomIndex].shown = true;
     this.words[this.randomIndex2].shown = true;
     this.showIndex++;
     this.showIndex2--;
     this.showIndex3++;
     this.showIndex4--;
   }

}
