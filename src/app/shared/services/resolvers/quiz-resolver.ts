import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import {map, Observable} from 'rxjs';
import {QuizCreation, QuizGame, QuizResponse} from "../../interfaces/Quiz.interface";
import {QuizService} from "../quiz.service";
import {Anime, AnimeGame} from "../../interfaces/AnimeRespose";

@Injectable({ providedIn: 'root' })
export class QuizResolver implements Resolve<QuizGame> {
  constructor(private quizService: QuizService) {}
  mapAnime(anime: Anime) {
    return {
      id: anime.id,
      title: anime.title.trim().length ? anime.title : anime.japaneseTitle,
      words: anime.description
        ? anime.description.split(' ').slice(0, 120).map(word => ({ text: word, shown: false }))
        : [],
      emojiDescription: anime.emojiDescription,
      thumbnail: anime.thumbnail,
      image: anime.thumbnail,
      type: anime.type,
      myanimeListId: anime.myanimeListId,
      properties: JSON.parse(anime.properties)
    };
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<QuizGame> {
    const id = route.params['id'];

    // @ts-ignore
    return this.quizService.quizById$(id).pipe(
      map((quiz: QuizResponse) => ({
        id: quiz.id,
        title: quiz.title,
        createdAt: quiz.createdAt,
        thumbnail: quiz.thumbnail,
        animes: quiz.animes.map((anime: Anime) => this.mapAnime(anime))
      }))
    );
  }
}


