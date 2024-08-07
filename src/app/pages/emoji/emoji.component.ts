import {Component, ElementRef, OnDestroy, Renderer2, ViewChild} from '@angular/core';
import {MyAnimeListService} from "../../shared/services/mal.service";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {EmojiQuizComponent} from "../../shared/components/quizzes/emoji-quiz/emoji-quiz.component";
import {DescriptionQuizComponent} from "../../shared/components/quizzes/description-quiz/description-quiz.component";
import {debounceTime, distinctUntilChanged, filter, interval, map, pipe} from 'rxjs';
import {Words} from "../../shared/interfaces/words.inteface";
import {ActivatedRoute, Router} from "@angular/router";
import {Anime, AnimeGame, DailyGameResult, DailyResponse, GameType} from "../../shared/interfaces/AnimeRespose";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {PopupService} from "../../shared/services/popup.service";
import {GameOverPopupComponent} from "../../shared/components/popup/game-over-popup/game-over-popup.component";
import {UtilityServiceService} from "../../shared/services/utility-service.service";
import {ShiftingImage} from "../../shared/components/quizzes/shifing-image/image-quiz.component";
import {ImageQuizComponent} from "../../shared/components/quizzes/image-quiz/image-quiz.component";

interface AnimeListItem {
  title: string;
  id: number;
}

@Component({
  selector: 'app-emoji',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    EmojiQuizComponent,
    DescriptionQuizComponent,
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    GameOverPopupComponent,
    ShiftingImage,
    ImageQuizComponent,
  ],
  templateUrl: './emoji.component.html',
  styleUrl: './emoji.component.scss'
})
export class EmojiComponent implements OnDestroy {
  // @ts-ignore
  @ViewChild('input') elementRef: ElementRef;
  protected readonly GameType = GameType;
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
  previousAnswer = '';
  gamePlayed = 0;
  keyEventListener: any;
  quizType = 'random';
  beforeUnloadListener: any;
  gameActionText = 'Start Game!';
  gameGuid = '';
  popupShown = false;
  constructor(private malService: MyAnimeListService,
              private renderer: Renderer2,
              private popupService: PopupService,
              private utility: UtilityServiceService,
              private router: Router,
              private actr: ActivatedRoute) {
    this.getDataFromSnapshot();

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
      // Handle the event
      if (!this.searchList.length) return;
      if (event.key == 'ArrowDown') {
        event.preventDefault();
        if (this.selectedItemIndex === this.searchList.length - 1) {
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

  getDataFromSnapshot() {
    const urlSegments = this.router.url.split('/');
    this.quizType = this.router.url.split('/')[urlSegments.length - 1]
    if (isNaN(parseInt(this.quizType))) {
      if (this.quizType === 'random') {
        this.quiz = this.actr.snapshot.data['data'].splice(0,5) as AnimeGame[];
        return;
      }
      this.gameGuid = this.actr.snapshot.data['data'].id;
      this.quiz = this.actr.snapshot.data['data'].anime.splice(0, 1) as AnimeGame[];
    } else {
      this.quiz = this.actr.snapshot.data['data'].animes.splice(0, 5) as AnimeGame[];
    }
    this.previousAnswer = this.quiz[this.selectedQuiz].title;
  }

  startGame() {
    this.elementRef.nativeElement.focus();
    this.gameStarted = !this.gameStarted;
    this.gameActionText = 'Play again!';

    this.interval = interval(1000).subscribe(() => {
      if (this.time === 20) {
        this.handleQuizChange();
        this.popupService.pushNewMessage(`The answer was: ${this.previousAnswer}`, 5);
      }
      this.time += 1;
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
            id: item.myanimeListId
          }
        })
      }
    );
  }

  selectAnswer(id: number) {
    if (!this.gameStarted) return;
    if (this.quiz[this.selectedQuiz].myanimeListId == id) {
      this.selectedItemIndex = 0;
      this.result += (100 + this.time * 5);
      this.handleQuizChange();
      this.inputControl.setValue('');
      this.popupService.pushNewMessage('Correct Answer', 3)
      return;
    }
    this.popupService.pushNewMessage('Incorrect Answer', 3)
  }

  handleQuizChange() {
    this.previousAnswer = this.quiz[this.selectedQuiz].title;
    if (this.selectedQuiz == this.quiz.length - 1) {
      this.time = 0;
      this.selectedQuiz = 0;
      this.gameStarted = false;
      this.inputControl.setValue('');
      this.interval.unsubscribe();
      this.gamePlayed++;
      if (this.quizType == 'daily') {
        const dailyResult: DailyGameResult = {result: this.result, gameId: this.gameGuid, type: this.quizType}
        this.malService.setDailyAnimePoints$(dailyResult).subscribe((res) => {
        }, error => console.log(error))
      }
      this.showPopUp();
      return;
    }
    this.time = 0;
    this.selectedQuiz++;
  }
  showPopUp(){
    this.popupShown = true;
  }

  handlePopupAction(event: string) {
    switch (event){
      case 'again':
        this.malService.gerRandomAnime$().pipe(
          map((animes: Anime[]) => animes.map((anime: Anime) => ({
            id: anime.id,
            title: anime.title.trim().length ? anime.title : anime.japaneseTitle,
            words: anime.description ? anime.description.split(' ').slice(0, 120).map(word => ({
              text: word,
              shown: false
            })) : [],
            emojiDescription: anime.emojiDescription,
            thumbnail: anime.thumbnail,
            image: anime.image,
            type: anime.type,
            myanimeListId: anime.myanimeListId,
            properties: anime.properties.split(',')
          })))
        ).subscribe((res: AnimeGame[])=>{
          this.quiz = res;
          this.popupShown = false;
          this.quizType = 'random';
          this.startGame();
        });
        break;
      case 'home':
        this.router.navigate(['/', 'game-modes'])
        break;
    }
  }
}
