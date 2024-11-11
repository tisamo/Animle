import {Component, ElementRef, OnDestroy, Renderer2, ViewChild} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {GameOverPopupComponent} from "../../shared/components/popup/game-over-popup/game-over-popup.component";
import {JsonPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {MyAnimeListService} from "../../shared/services/mal.service";
import {PopupService} from "../../shared/services/popup.service";
import {ActivatedRoute, Router} from "@angular/router";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {debounceTime, distinctUntilChanged, map} from "rxjs";
import {AnimeListItem} from "../../shared/interfaces/search-list";
import {GuessGame} from "../../shared/interfaces/GuessGame.interface";
import {GuessGameProgress} from "../../shared/interfaces/GuessGame";
import {AuthService} from "../../shared/services/auth.service";

@Component({
  selector: 'app-guess-game',
  standalone: true,
  imports: [
    FormsModule,
    GameOverPopupComponent,
    NgForOf,
    NgIf,
    NgClass,
    ReactiveFormsModule,
    JsonPipe
  ],
  templateUrl: './guess-game.component.html',
  styleUrl: './guess-game.component.scss'
})
export class GuessGameComponent implements OnDestroy{
  // @ts-ignore
  @ViewChild('input') elementRef: ElementRef;
  searchList: AnimeListItem[] = [];
  inputControl = new FormControl<string>('', []);
  result = 0;
  animeToGuess: GuessGame;
  clue: string[] = [];
  solution: string[] = [];

  attempts = 0;
  selectedItemIndex = 0;
  keyEventListener: any;
  popupShown = false;
  constructor(private malService: MyAnimeListService,
              private renderer: Renderer2,
              private animeService: MyAnimeListService,
              private auth: AuthService,
              private actr: ActivatedRoute,
              private popupService: PopupService) {

    this.listenToKeyEvents();
    this.inputControl.valueChanges.pipe(takeUntilDestroyed(), debounceTime(200), distinctUntilChanged()).subscribe(
      (filterString) => this.filterItems(filterString ? filterString : ''))
   this.animeToGuess = this.actr.snapshot.data['data'] as GuessGame;
   this.solution = this.splitEmoji(this.animeToGuess.EmojiDescription);
   this.attempts = this.animeToGuess.Attempts;
    this.clue = this.solution.slice(0,2 + this.attempts);

  }

  ngOnDestroy(): void {
    this.keyEventListener();
  }

  listenToKeyEvents() {
    this.keyEventListener = this.renderer.listen(window, 'keydown', event => {
      if (!this.searchList.length) return;
      if (event.key == 'ArrowDown') {
        event.preventDefault();
        if (this.selectedItemIndex === this.searchList.length ) {
          this.selectedItemIndex = 0;
          return;
        }
        this.selectedItemIndex++;
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (this.selectedItemIndex === 0) return;
        this.selectedItemIndex--;
      }
      if (event.key == 'Enter') {
        this.selectAnswer(this.searchList[this.selectedItemIndex].id);
      }
    });
  }

  filterItems(filterString: string) {
    if (filterString.length < 1) {
      this.searchList = [];
      return;
    }
    this.malService.filterAnime$(filterString).subscribe(
      (res) => {
        this.searchList = res.map((item) => {
          return {
            title: item.title.trim().length ? item.title : item.japaneseTitle,
            id: item.id
          }
        })
      }
    );
  }

  selectAnswer(id: number) {
    this.attempts++;
    if (this.animeToGuess.AnimeId == id) {
      this.popupService.pushNewMessage('You Won!', 3);
      const score = 1000 - (this.attempts - 1) * 200;
      this.saveUsersProgress(score);
      return;
    }
    this.popupService.pushNewMessage('Incorrect Answer', 3);
    this.saveUsersProgress(0);
    if(this.attempts == 5){
      this.inputControl.setValue('');
    }

    this.clue = this.solution.slice(0, 2+ this.attempts);

  }

  splitEmoji(emojiToSplit: string) {
    return [...new Intl.Segmenter().segment(emojiToSplit)].map(x => x.segment)
  }

  saveUsersProgress(result: number){
    const progress: GuessGameProgress = {guessGameId: this.animeToGuess.Id, attempts: this.attempts, result: result, fingerprint: this.auth.fingerPrintOfDevice};
    this.animeService.saveGuessGameProgress(progress).subscribe((res)=>{
      console.log(res);
    }, err=>{
      console.log(err);
    });
  }



  handlePopupAction(event: string) {

  }
}
