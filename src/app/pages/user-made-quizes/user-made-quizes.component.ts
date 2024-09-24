import {Component} from '@angular/core';
import {ActivatedRoute, NavigationExtras, Router, RouterLink} from "@angular/router";
import {QuizGame, QuizList} from "../../shared/interfaces/Quiz.interface";
import {JsonPipe, NgForOf, NgIf} from "@angular/common";
import {PagerComponent} from "../../shared/components/elements/pager/pager.component";
import {QuizService} from "../../shared/services/quiz.service";
import {SimpleResponse} from "../../shared/interfaces/simple-response";
import {UtilityServiceService} from "../../shared/services/utility-service.service";

@Component({
  selector: 'app-user-made-quizes',
  standalone: true,
  imports: [
    RouterLink,
    JsonPipe,
    NgForOf,
    PagerComponent,
    NgIf
  ],
  templateUrl: './user-made-quizes.component.html',
  styleUrl: './user-made-quizes.component.scss'
})
export class UserMadeQuizesComponent {
  quizList: QuizGame[] = [];
  userLikes: number[] = [];
  itemCount = 0;
  limit = 25;
  constructor(private actr: ActivatedRoute,
              private router: Router,
              private utilityService: UtilityServiceService,
              private quizService: QuizService) {
    const snapshot = this.actr.snapshot.data['quizList'] as QuizList;
    this.quizList = snapshot.quizzes.list;
    this.itemCount = snapshot.quizzes.count;
    this.userLikes = snapshot.likedQuizzes;

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

  pageChange(page: number) {
    const queryParams: NavigationExtras = {
      queryParams: { page: page, limit: 25 },
      queryParamsHandling: 'merge',
      replaceUrl: true
    };

    this.router.navigate([], queryParams);
  }
}

