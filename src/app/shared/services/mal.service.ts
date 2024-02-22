import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from "../../../environments/environment";
import {Anime, DailyGameResult} from "../interfaces/AnimeRespose";
import {SimpleResponse} from "../interfaces/simple-response";

@Injectable({
  providedIn: 'root'
})
export class MyAnimeListService {

  constructor(private http: HttpClient) {
  }

  getDailyAnime$(): Observable<string> {
    return this.http.get(`${environment.apiUrl}anime/daily`, { responseType: 'text' });
  }

  setDailyAnimePoints$(gameResult: DailyGameResult): Observable<SimpleResponse> {
    return this.http.post<SimpleResponse>(`${environment.apiUrl}anime/contest`, gameResult);
  }


  gerRandomAnime$(): Observable<Anime[]> {
    return this.http.get<Anime[]>(`${environment.apiUrl}anime/random`)
  }
  filterAnime$(name: string): Observable<Anime[]> {
    return this.http.get<Anime[]>(`${environment.apiUrl}anime/filter?q=${name}`)
  }
}
