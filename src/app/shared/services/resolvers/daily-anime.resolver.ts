import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {catchError, map, Observable, tap, throwError} from 'rxjs';
import {Anime, AnimeGame, DailyGame, DailyResponse} from "../../interfaces/AnimeRespose";
import {MyAnimeListService} from "../mal.service";
import {CryptoService} from "../crypto.service";
import {PopupService} from "../popup.service";

@Injectable({providedIn: 'root'})
export class DailyAnimeResolver implements Resolve<DailyGame> {
  constructor(private malService: MyAnimeListService,
              private popupService: PopupService,
              private router: Router,
              private cryptoService: CryptoService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.malService.getDailyAnime$().pipe(
      tap((an)=>{
        console.log(an);
      }),
      map((animes: any): DailyGame => {
        return {
          id: animes.id,
          type: animes.type,
          createdAt: animes.timeCreated,
          anime: animes.animes.map((a: Anime) => {
            return {
              id: a.id,
              title: a.title,
              words: a.description ? a.description.split(' ').slice(0, 120).map((w) => {
                return {
                  text: w,
                  shown: false
                }
              }) : [],
              emojiDescription: a.emojiDescription,
              thumbnail: a?.thumbnail,
              image: a.image,
              type: a.type,
              myanimeListId: a.myanimeListId,
              properties: a.properties.split(',')
            };
          })
        }
      }),
      catchError((err) => {
        const res = JSON.parse(err.error);
        this.popupService.pushNewMessage(res.response, 3);

        return this.router.navigate(['/']);
      }));
  }
}
