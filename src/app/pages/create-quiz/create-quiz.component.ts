import {Component, OnDestroy, Renderer2} from '@angular/core';
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {debounceTime, distinctUntilChanged} from "rxjs";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MyAnimeListService} from "../../shared/services/mal.service";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {PopupService} from "../../shared/services/popup.service";
import {QuizService} from "../../shared/services/quiz.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Anime} from "../../shared/interfaces/AnimeRespose";
interface AnimeEditListItem{
  id: string;
  title: string;
  thumbnail:string;
}
interface AnimeForEditing{
  title: string;
  animes: Anime[];
  id: string;
  thumbnail: string;
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
  searchList: AnimeEditListItem[] = [];
  selectedList: AnimeEditListItem[] = [];
  selectedItemIndex = 0;
  editMode = false;
  keyEventListener:any;
  selectedImageId = 0;
  constructor(private malService: MyAnimeListService,
              private quizService: QuizService,
              private actr: ActivatedRoute,
              private router: Router,
              private renderer: Renderer2,
              private popupService: PopupService) {
    this.inputControl.valueChanges.pipe(takeUntilDestroyed(), debounceTime(200), distinctUntilChanged()).subscribe(
      (filterString)=> this.filterItems(filterString ? filterString : ''))
    this.listenToKeyEvents();
    this.initQuizForEditing();
  }

  ngOnDestroy(): void {
    this.keyEventListener();
  }

  initQuizForEditing(){
    if(this.actr.snapshot.data['data']){
      this.editMode = true;
      const animeForEditing: AnimeForEditing = this.actr.snapshot.data['data'] as AnimeForEditing;
      this.titleName = animeForEditing.title;
      const index =  animeForEditing.animes.findIndex((a)=> a.thumbnail == animeForEditing.thumbnail);
      if(index > -1){
        this.selectedImageId = index;
      }
      this.selectedList = animeForEditing.animes.map((m) => {
        return {
          thumbnail: m.thumbnail,
          id: m.myanimeListId.toString(),
          title: m.title.trim().length ? m.title : (m.japaneseTitle),
        };
      });

    }
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
            id: item.myanimeListId.toString(),
            thumbnail: item.thumbnail
          }
        })
      }
    );
  }
  selectAnswer(a: AnimeEditListItem){
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
    const pos =  this.selectedList.findIndex((a)=> +a.id == this.selectedImageId );
    if(pos > -1){
      this.selectedImageId = pos;
    } else{
      if(this.selectedList.length){
        this.selectedImageId = 0;
      }
    }
  }

  saveQuiz() {
    const animeIds: number[] = this.selectedList.map((x)=> +x.id);
    if(!this.selectedList.length || !this.titleName.length){
      return;
    }
    if(this.editMode){
      const id = +this.actr.snapshot.params['id'];
      this.quizService.editQuiz$({id: id, title: this.titleName, animeIds, selectedImageId:
          +this.selectedList[this.selectedImageId].id })
        .subscribe((res)=>{
          this.popupService.pushNewMessage('Quiz successfully created!',3)
          this.router.navigate(['', 'quiz'])
        });
      return;
    }
    this.quizService.createQuiz$({title: this.titleName, animeIds, selectedImageId:
      +this.selectedList[this.selectedImageId].id })
      .subscribe((res)=>{
        this.popupService.pushNewMessage('Quiz successfully created!',3)
        this.router.navigate(['', 'quiz'])
      });
  }
}
