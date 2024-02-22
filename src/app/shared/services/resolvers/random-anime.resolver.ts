import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import {map, Observable} from 'rxjs';
import {MyAnimeListService} from "../mal.service";
import {Anime, AnimeGame} from "../../interfaces/AnimeRespose";

@Injectable({ providedIn: 'root' })
export class RandomAnimeResolver implements Resolve<AnimeGame[]> {
  constructor(private malService: MyAnimeListService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AnimeGame[]> {
    return this.malService.gerRandomAnime$().pipe(
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
        properties: JSON.parse(anime.properties)
      })))
    );
  }

}


