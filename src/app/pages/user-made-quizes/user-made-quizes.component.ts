import {Component} from '@angular/core';
import {ActivatedRoute, NavigationExtras, Router, RouterLink} from "@angular/router";
import {QuizGame, QuizList} from "../../shared/interfaces/Quiz.interface";
import {JsonPipe, NgForOf, NgIf} from "@angular/common";
import {PagerComponent} from "../../shared/components/elements/pager/pager.component";
import {QuizService} from "../../shared/services/quiz.service";
import {SimpleResponse} from "../../shared/interfaces/simple-response";
import {UtilityServiceService} from "../../shared/services/utility-service.service";
import {AuthService} from "../../shared/services/auth.service";
import {GuardedElementComponent} from "../../shared/components/elements/guarded-element/guarded-element.component";

@Component({
  selector: 'app-user-made-quizes',
  standalone: true,
  imports: [
    RouterLink,
    JsonPipe,
    NgForOf,
    PagerComponent,
    NgIf,
    GuardedElementComponent
  ],
  templateUrl: './user-made-quizes.component.html',
  styleUrl: './user-made-quizes.component.scss'
})
export class UserMadeQuizesComponent {
  quizList: QuizGame[] = [];
  userLikes: number[] = [];
  itemCount = 0;
  limit = 25;
  userId: number | null = null;
  constructor(private actr: ActivatedRoute,
              private router: Router,
              public authService: AuthService,
              private utilityService: UtilityServiceService,
              private quizService: QuizService) {
          this.loadInitialQuizzes();
          this.listenToQueryParamChange();
  }

  loadInitialQuizzes(){
    const snapshot = this.actr.snapshot.data['quizList'] as QuizList;
    this.quizList = snapshot.quizzes.list;
    this.itemCount = snapshot.quizzes.count;
    this.userLikes = snapshot.likedQuizzes;
    this.userId = this.authService.userId;
  }

  listenToQueryParamChange(){
    this.actr.queryParams.subscribe((params)=>{
      this.quizService.getQuizzes$(this.utilityService.createQueryString(params)).subscribe({
        next: (res) => {
          this.quizList = res.list;
          this.itemCount = res.count;
        },
        error: (err) => console.log(err)
      })
    })
  }

  likeQuiz(quizId: number) {
    this.quizService.likeQuiz$(quizId).subscribe(({
      next: (res: SimpleResponse) => {
        if (res.response == 'Quiz Removed') {
          const index = this.userLikes.findIndex(x => x == quizId);
          if (index > -1) {
            this.userLikes.splice(index, 1);
          }
        } else {
          this.userLikes.push(quizId)
        }
      },
      error: (err) => console.log(err)
    }));
  }

  pageChange(page: number, sort: null | string = null, user: number | null= null, top: string | null= null) {
    const queryParams: NavigationExtras = {
      queryParams: { page: page, limit: 20, sort: sort, user: user, top: top},
      queryParamsHandling: 'merge',
      replaceUrl: true
    };

    this.router.navigate([], queryParams);
  }
}

