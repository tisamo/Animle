import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {GameOverPopupComponent} from "../../shared/components/popup/game-over-popup/game-over-popup.component";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {Words} from "../../shared/interfaces/words.inteface";
import {Anime, AnimeGame, DailyGameResult} from "../../shared/interfaces/AnimeRespose";
import {MyAnimeListService} from "../../shared/services/mal.service";
import {PopupService} from "../../shared/services/popup.service";
import {UtilityServiceService} from "../../shared/services/utility-service.service";
import {ActivatedRoute, Router} from "@angular/router";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {debounceTime, distinctUntilChanged, map} from "rxjs";
import {AnimeListItem} from "../../shared/interfaces/search-list";

@Component({
  selector: 'app-guess-game',
  standalone: true,
  imports: [
    FormsModule,
    GameOverPopupComponent,
    NgForOf,
    NgIf,
    NgClass,
    ReactiveFormsModule
  ],
  templateUrl: './guess-game.component.html',
  styleUrl: './guess-game.component.scss'
})
export class GuessGameComponent {
  // @ts-ignore
  @ViewChild('input') elementRef: ElementRef;
  searchList: AnimeListItem[] = [];
  inputControl = new FormControl<string>('', []);
  gameStarted = false;
  gameEnded = false;
  time = 0;
  interval: any;
  words: Words[] = []
  quiz: AnimeGame[] = [];
  result = 0;
  selectedQuiz = 0;
  selectedItemIndex = 0;
  gamePlayed = 0;
  keyEventListener: any;
  beforeUnloadListener: any;
  gameActionText = 'Start Game!';
  popupShown = false;
  constructor(private malService: MyAnimeListService,
              private renderer: Renderer2,
              private popupService: PopupService) {

    this.listenToKeyEvents();
    this.beforeUnloadListener = this.renderer.listen(window, 'onbeforeunload', this.handleBeforeUnload);
    this.inputControl.valueChanges.pipe(takeUntilDestroyed(), debounceTime(200), distinctUntilChanged()).subscribe(
      (filterString) => this.filterItems(filterString ? filterString : ''))

  }

  ngOnDestroy(): void {
    if (this.interval) {
      this.interval.unsubscribe();
    }
    this.beforeUnloadListener();
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

  handleBeforeUnload() {
    if (this.gameStarted && !this.gameEnded) {
      localStorage.setItem('leftTournament', 'yes');
    }
  }

  startGame() {
    this.elementRef.nativeElement.focus();
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
            id: item.myanimeListId
          }
        })
      }
    );
  }

  selectAnswer(id: number) {
    if (!this.gameStarted) return;
    if (this.quiz[this.selectedQuiz].myanimeListId == id) {
      this.popupService.pushNewMessage('You Won!', 3)
      return;
    }
    this.popupService.pushNewMessage('Incorrect Answer', 3)
  }


  handlePopupAction(event: string) {

  }
}
