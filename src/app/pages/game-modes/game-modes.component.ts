import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";
import {GuardedElementComponent} from "../../shared/components/elements/guarded-element/guarded-element.component";

@Component({
  selector: 'app-game-modes',
  standalone: true,
  imports: [
    RouterLink,
    GuardedElementComponent
  ],
  templateUrl: './game-modes.component.html',
  styleUrl: './game-modes.component.scss'
})
export class GameModesComponent {}
