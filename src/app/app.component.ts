import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {HeaderComponent} from "./core/header/header.component";
import {FooterComponent} from "./core/footer/footer.component";
import {MessageComponent} from "./shared/components/popup/message/message.component";
import {PopupService} from "./shared/services/popup.service";
import {AuthService} from "./shared/services/auth.service";
import {GameOverPopupComponent} from "./shared/components/popup/game-over-popup/game-over-popup.component";
import {environment} from "../environments/environment";
import {MyAnimeListService} from "./shared/services/mal.service";

interface Animoji {
  title: string;
  emoji: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent, MessageComponent, GameOverPopupComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent  {
  constructor(public popupService: PopupService) {

  }
}
