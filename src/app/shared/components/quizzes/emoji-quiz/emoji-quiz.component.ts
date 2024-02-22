import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-emoji-quiz',
  standalone: true,
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './emoji-quiz.component.html',
  styleUrl: './emoji-quiz.component.scss'
})
export class EmojiQuizComponent implements OnChanges {
  @Input() time: number | null = null;
  @Input() emojis: string = '';
  emojisDisplayed: string[] = [];
  emojiArray: string[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.time) {
      return;
    }
    if (this.time === 1) {
      this.emojiArray = this.emojiStringToArray(this.emojis);
      this.emojisDisplayed = this.emojiArray.splice(0, 2);
    }

    if (this.time % 4 === 0 && this.time !== 20) {
      const item = this.emojiArray.shift() as string;
      this.emojisDisplayed.push(item);
    }
  }

  splitEmoji(emojiToSplit: string) {
    return [...new Intl.Segmenter().segment(emojiToSplit)].map(x => x.segment)
  }

  emojiStringToArray(emojiString: string) {
    let split = this.splitEmoji(emojiString);
    for (let i = split.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = split[i];
      split[i] = split[j];
      split[j] = temp;
    }
    return split;
  };


}
