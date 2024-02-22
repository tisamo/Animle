import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable} from 'rxjs';
import {QuizService} from "../quiz.service";
import {QuizList} from "../../interfaces/Quiz.interface";
import {UtilityServiceService} from "../utility-service.service";

@Injectable({ providedIn: 'root' })
export class QuizlistResolver implements Resolve<QuizList> {
  constructor(private quizService: QuizService,
              private utilityService: UtilityServiceService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<QuizList> {
    const queryString = this.utilityService.createQueryString(route.queryParams);
    return forkJoin({
      quizzes: this.quizService.getQuizzes$(queryString),
      likedQuizzes: this.quizService.getUserLikedQuizes$()
    });
  }
}
