import { Component } from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-guarded-element',
  standalone: true,
  imports: [
    NgIf,
    RouterLink
  ],
  templateUrl: './guarded-element.component.html',
  styleUrl: './guarded-element.component.scss'
})
export class GuardedElementComponent {
  constructor(public authService: AuthService) {}
}
