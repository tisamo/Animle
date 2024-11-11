import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {catchError, from, map, Observable, of, switchMap} from 'rxjs';
import {DailyGame} from "../../interfaces/AnimeRespose";
import {MyAnimeListService} from "../mal.service";
import {AuthService} from "../auth.service";

@Injectable({providedIn: 'root'})
export class DailyAnimeResolver implements Resolve<DailyGame | null> {
  constructor(private malService: MyAnimeListService,
              private authService: AuthService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<DailyGame | null> {
    return from(this.authService.getFingerPrint()).pipe(
      switchMap(fingerprint =>
        this.malService.getDailyAnime$(fingerprint).pipe(
          map((animes: any): DailyGame => {
            return {
              id: animes.id,
              type: animes.type,
              createdAt: animes.timeCreated,
              anime: animes.animes.map((a: any) => ({
                id: a.id,
                title: a.title,
                words: a.description ? a.description.split(' ').slice(0, 120).map((w: any) => ({
                  text: w,
                  shown: false
                })) : [],
                emojiDescription: a.emojiDescription,
                thumbnail: a?.thumbnail,
                image: a.image,
                type: a.type,
                myanimeListId: a.myanimeListId,
                properties: a.properties.split(',')
              }))
            };
          }),
          catchError(error => {
            return of(null);
          })
        )
      )
    );
  }
}
