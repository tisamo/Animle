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
export class VersusComponent implements OnInit, OnDestroy, AfterViewInit{
  protected readonly GameType = GameType;

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
  keyEventListener: any;
  beforeUnloadListener: any;

  constructor(private signalR: SignalrService,
              private renderer: Renderer2,
              private malService: MyAnimeListService,
              private popupService: PopupService) {
    this.signalR.initConnectionAndListeners(this.mapAnimes);
    this.listenToKeyEvents();
    this.subscribeToGameEvents();

  }

  async ngOnInit(): Promise<void> {
    await this.signalR.startConnection();
    await this.signalR.registerPlayer();
    await this.signalR.findOpponent();
  }
  mapAnimes(animes?: Anime[]){
    if(!animes){
      return ;
    }
    return animes.map((a: Anime): AnimeGame => {
      return {
        id: a.id,
        title: a.title,
        words: a.description ? a.description.split(' ').slice(0,120).map((w)=>{
          return{
            text: w,
            shown: false
          }
        }) : [],
        emojiDescription: a.emojiDescription,
        thumbnail: a?.thumbnail,
        image: a.image,
        type: a.type,
        myanimeListId: a.myanimeListId,
        properties: JSON.parse(a.properties)
      };
    });
  }

  async ngOnDestroy(): Promise<void> {
    await this.signalR.disconnect();

    if(this.interval){
      this.interval.unsubscribe();
    }
    this.beforeUnloadListener();
    this.keyEventListener();
  }

  ngAfterViewInit() {
    this.signalR.dataSubject.subscribe((data)=>{
      this.quiz = data as AnimeGame[];
      this.startGame();
    });
  }

  listenToKeyEvents(){
    this.keyEventListener = this.renderer.listen(window, 'keydown', event => {
      // Handle the event
      if(!this.searchList.length) return;
      if(event.key == 'ArrowDown'){
        event.preventDefault();
        if(this.selectedItemIndex === this.searchList.length -1){
          this.selectedItemIndex = 0;
          return;
        }
        this.selectedItemIndex++;
      }
      if(event.key === 'ArrowUp'){
        event.preventDefault();
        if(this.selectedItemIndex ===0) return;
        this.selectedItemIndex--;
      }
      if(event.key == 'Enter'){
        this.selectAnswer(this.searchList[this.selectedItemIndex].id)
        this.selectedItemIndex = 0;
        this.inputControl.setValue('');
      }
    });
  }

  subscribeToGameEvents(){
    this.signalR.nextSubject.pipe(takeUntilDestroyed()).subscribe(async (message)=>{
      if(message == 'opd'){
        this.quiz = [];
        this.time = 0;
        alert("opponent disconnected");
        this.interval.unsubscribe();
      } else{
        this.inputControl.setValue('');
        await this.handleQuizChange();
      }

    });
    this.signalR.endGameResult.pipe(takeUntilDestroyed()).subscribe((data)=>{

    })
    this.inputControl.valueChanges.pipe(takeUntilDestroyed(), debounceTime(200), distinctUntilChanged()).subscribe(
      (filterString)=> this.filterItems(filterString ? filterString : ''))
  }
   startGame() {
    this.elementRef?.nativeElement.focus();
    this.gameStarted = true;
    this.interval = interval(1000).subscribe(async () => {
      if (this.time === 20) {
      await   this.handleQuizChange();
      }
      this.time += 1;
    });
  }
  filterItems(filterString: string ) {
    if(filterString.length < 2){
      this.searchList = [];
      return;
    }
    this.malService.filterAnime$(filterString).subscribe(
      (res) => {
        this.searchList = res.map((item)=>{
          return{
            title: item.title.trim().length ? item.title : item.japaneseTitle,
            id: item.myanimeListId
          }
        })
      },
    );
  }
  async selectAnswer(id: number){
    if(this.quiz[this.selectedQuiz].myanimeListId ==id){
      this.result += (100 + this.time * 5);
      await this.signalR.next();
      return;
    }
    this.popupService.pushNewMessage('Incorrect Answer', 3)
  }
  async handleQuizChange(){
    if(this.selectedQuiz == this.quiz.length -1){
      this.time = 0;
      this.selectedQuiz = 0;
      this.gameStarted = false;
      this.inputControl.setValue('');
      this.interval.unsubscribe();
      await this.signalR.endGame(this.result);
      return;
    }
    this.time = 0;
    this.selectedQuiz++;
  }

}
