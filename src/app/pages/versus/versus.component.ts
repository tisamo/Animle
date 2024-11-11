import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {SignalrService} from "../../shared/services/signalr.service";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Words} from "../../shared/interfaces/words.inteface";
import {Anime, AnimeGame, GameType} from "../../shared/interfaces/AnimeRespose";
import {DescriptionQuizComponent} from "../../shared/components/quizzes/description-quiz/description-quiz.component";
import {EmojiQuizComponent} from "../../shared/components/quizzes/emoji-quiz/emoji-quiz.component";
import {ImageQuizComponent} from "../../shared/components/quizzes/image-quiz/image-quiz.component";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {PopupService} from "../../shared/services/popup.service";
import {MyAnimeListService} from "../../shared/services/mal.service";
import {debounceTime, distinctUntilChanged, interval} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

interface AnimeListItem {
  title: string;
  id: number;
}

@Component({
  selector: 'app-versus',
  standalone: true,
  imports: [
    DescriptionQuizComponent,
    EmojiQuizComponent,
    FormsModule,
    ImageQuizComponent,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './versus.component.html',
  styleUrl: './versus.component.scss',
  providers: [SignalrService]
})
export class VersusComponent implements OnInit, OnDestroy {
  protected readonly GameType = GameType;
  @ViewChild('input') elementRef: ElementRef | null = null;
  searchList: AnimeListItem[] = [];
  inputControl = new FormControl<string>('', []);
  gameStarted = false;
  time = 0;
  words: Words[] = []
  quiz: AnimeGame | null = null;
  result = 0;
  selectedItemIndex = 0;
  keyEventListener: any;
  beforeUnloadListener: any;

  constructor(private signalR: SignalrService,
              private renderer: Renderer2,
              private malService: MyAnimeListService,
              private popupService: PopupService) {
    this.signalR.initConnectionAndListeners(this.mapAnimes);
    this.listenToKeyEvents();
    this.subscribeToGameEvents();
    this.signalR.dataSubject.subscribe((time: number) => {
      this.time = time;
    });
  }

  async ngOnInit(): Promise<void> {
    await this.signalR.startConnection();
    await this.signalR.registerPlayer();
    await this.signalR.findOpponent();
  }
  mapAnimes(a?: Anime) {
    if (!a) {
      return;
    }
      return {
        id: a.id,
        title: a.title,
        words: a.description ? a.description.split(' ').slice(0, 120).map((w) => {
          return {
            text: w,
            shown: false
          }
        }) : [],
        emojiDescription: a.emojiDescription,
        thumbnail: a?.thumbnail,
        timeSent: a.timesent,
        image: a.image,
        type: a.type,
        myanimeListId: a.myanimeListId,
        properties: JSON.parse(a.properties)
      };
  }

  async ngOnDestroy(): Promise<void> {
    await this.signalR.disconnect();
    this.beforeUnloadListener();
    this.keyEventListener();
  }


  listenToKeyEvents() {
    this.keyEventListener = this.renderer.listen(window, 'keydown', event => {
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
        this.selectAnswer(this.searchList[this.selectedItemIndex].id)
        this.selectedItemIndex = 0;
        this.inputControl.setValue('');
      }
    });
  }

  subscribeToGameEvents() {
    this.signalR.nextSubject.pipe(takeUntilDestroyed()).subscribe(async (message) => {
      if (message == 'opd') {
        this.quiz = null;
        this.time = 0;
        alert("opponent disconnected");
      } else {
        this.inputControl.setValue('');
        if(this.selectedItemIndex == 0){
          this.startGame();
        }
        this.quiz = this.mapAnimes(message) as AnimeGame;
        await this.handleQuizChange();
      }

    });
    this.signalR.endGameResult.pipe(takeUntilDestroyed()).subscribe((data) => {
      this.gameStarted = true;
      this.searchList = [];
    })
    this.inputControl.valueChanges.pipe(takeUntilDestroyed(), debounceTime(200), distinctUntilChanged()).subscribe(
      (filterString) => this.filterItems(filterString ? filterString : ''))
  }

  async startGame() {
    this.elementRef?.nativeElement.focus();
    this.gameStarted = false;
    await this.signalR.findOpponent();
  }

  filterItems(filterString: string) {
    if (filterString.length < 2) {
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
      },
    );
  }

  async selectAnswer(id: number) {
    if(!this.quiz) return;
    if (this.quiz.myanimeListId == id) {
      this.result += (100 + this.time * 5);
      await this.signalR.next(this.result);
      return;
    }
    this.popupService.pushNewMessage('Incorrect Answer', 3)
  }

  async handleQuizChange() {
      this.gameStarted = false;
      this.inputControl.setValue('');
      return;
    }

}
