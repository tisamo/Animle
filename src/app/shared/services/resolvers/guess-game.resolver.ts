import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { map, Observable } from 'rxjs';
import { MyAnimeListService } from "../mal.service";
import { GuessGame } from "../../interfaces/GuessGame.interface";
import { CryptoService } from "../crypto.service";
import { AuthService } from "../auth.service";

@Injectable({ providedIn: 'root' })
export class GuessGameResolver implements Resolve<GuessGame> {
  constructor(
    private malService: MyAnimeListService,
    private auth: AuthService,
    private cryptoService: CryptoService
  ) {}

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<GuessGame> {
    const fingerPrint = await this.auth.getFingerPrint();

    const encryptedData = await this.malService.getDailyAnimeGuess(fingerPrint).toPromise();

    const decryptedData = this.cryptoService.decryptData(encryptedData?.response);
    return JSON.parse(decryptedData) as GuessGame;
  }
}
