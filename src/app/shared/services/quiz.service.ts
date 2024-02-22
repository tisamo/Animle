import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {QuizCreation, QuizResponse} from "../interfaces/Quiz.interface";
import {SimpleResponse} from "../interfaces/simple-response";
import {ListData} from "../interfaces/list.interface";

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  constructor(private http: HttpClient) { }

  createQuiz$(quiz: QuizCreation){
    return this.http.post(`${environment.apiUrl}quiz`, quiz);
  }
    getQuizzes$(queryString = ""): Observable< ListData<QuizResponse>>{
    return this.http.get< ListData<QuizResponse>>(`${environment.apiUrl}quiz${queryString}`);
  }

  likeQuiz$(quizId: number): Observable<SimpleResponse>{
    return this.http.get<SimpleResponse>(`${environment.apiUrl}quiz/like/${quizId}`);
  }

  getUserLikedQuizes$(): Observable<number[]>{
    return this.http.get<number[]>(`${environment.apiUrl}quiz/likes`);
  }
  quizById$(id: string): Observable<QuizResponse>{
    return this.http.get<QuizResponse>(`${environment.apiUrl}quiz/${id}`);
  }
}
