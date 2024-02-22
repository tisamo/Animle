import {Component, OnDestroy, Renderer2} from '@angular/core';
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {debounceTime, distinctUntilChanged} from "rxjs";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MyAnimeListService} from "../../shared/services/mal.service";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {PopupService} from "../../shared/services/popup.service";
import {QuizService} from "../../shared/services/quiz.service";
import {Router} from "@angular/router";

interface Anime{
  id: number;
  title: string;
  thumbnail:string;
}
@Component({
  selector: 'app-create-quiz',
  standalone: true,
  imports: [
    NgForOf,
    ReactiveFormsModule,
    NgClass,
    FormsModule,
    NgIf
  ],
  templateUrl: './create-quiz.component.html',
  styleUrl: './create-quiz.component.scss'
})
export class CreateQuizComponent implements OnDestroy{
  inputControl = new FormControl();
  titleName = '';
  searchList: Anime[] = [];
  selectedList: Anime[] = [];
  selectedItemIndex = 0;
  keyEventListener:any;
  selectedImageId = 0;
  constructor(private malService: MyAnimeListService,
              private quizService: QuizService,
              private router: Router,
              private renderer: Renderer2,
              private popupService: PopupService) {
    this.inputControl.valueChanges.pipe(takeUntilDestroyed(), debounceTime(200), distinctUntilChanged()).subscribe(
      (filterString)=> this.filterItems(filterString ? filterString : ''))
    this.listenToKeyEvents()
  }
  ngOnDestroy(): void {
    this.keyEventListener();
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
        this.selectAnswer(this.searchList[this.selectedItemIndex])
        this.selectedItemIndex = 0;
      }
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
            id: item.myanimeListId,
            thumbnail: item.thumbnail
          }
        })
      }
    );
  }
  selectAnswer(a: Anime){
    if(this.selectedList.some((x)=> x.id == a.id)){
      this.popupService.pushNewMessage('Anime already in the list', 3);
      return;
    }
    this.searchList = [];
    this.inputControl.setValue('');
    this.popupService.pushNewMessage(`${a.title} added to the list`, 3);
    this.selectedList.push(a);
  }

  removeFromList(index: number) {
   this.selectedList.splice(index,1);
  }

  saveQuiz() {
    const animeIds: number[] = this.selectedList.map((x)=> x.id);

    this.quizService.createQuiz$({title: this.titleName, animeIds, selectedImageId:
      this.selectedList[this.selectedImageId].id })
      .subscribe((res)=>{
        this.popupService.pushNewMessage('Quiz successfully created!',3)
        this.router.navigate(['', 'quiz'])
      });
  }
}
