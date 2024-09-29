import { Routes } from '@angular/router';

import {QuizlistResolver} from "./shared/services/resolvers/quizlist.resolver";
import {QuizResolver} from "./shared/services/resolvers/quiz-resolver";
import {RandomAnimeResolver} from "./shared/services/resolvers/random-anime.resolver";
import {DailyAnimeResolver} from "./shared/services/resolvers/daily-anime.resolver";
import {AuthGuard} from "./shared/services/guard/auth.guard";

export const routes: Routes = [
  {path: '', loadComponent: () => import('./pages/home/home.component').then((mod=> mod.HomeComponent))},
  {path: 'daily',canActivate: [AuthGuard], resolve:{data: DailyAnimeResolver},  loadComponent: () => import('./pages/emoji/emoji.component').then((mod=> mod.EmojiComponent))},
  {path: 'random', resolve:{data: RandomAnimeResolver},  loadComponent: () => import('./pages/emoji/emoji.component').then((mod=> mod.EmojiComponent))},
  {path: 'leader-board',  loadComponent: () => import('./pages/leader-board/leader-board.component').then((mod=> mod.LeaderBoardComponent))},
  {path: 'quiz', canActivate: [AuthGuard], resolve: {quizList: QuizlistResolver}, loadComponent: () => import('./pages/user-made-quizes/user-made-quizes.component').then((mod=> mod.UserMadeQuizesComponent))},
 // {path: 'quiz/create', canActivate: [AuthGuard], loadComponent: () => import('./pages/create-quiz/create-quiz.component').then((mod=> mod.CreateQuizComponent))},
 // {path: 'quiz/:id', resolve:{data: QuizResolver}, loadComponent: () => import('./pages/emoji/emoji.component').then((mod=> mod.EmojiComponent))},
  // {path: 'versus',canActivate: [AuthGuard], loadComponent: () => import('./pages/versus/versus.component').then((compo=> compo.VersusComponent))},
  {path: 'game-modes', loadComponent: () => import('./pages/game-modes/game-modes.component').then((mod=> mod.GameModesComponent))},
  {path: 'guess-game', loadComponent: () => import('./pages/guess-game/guess-game.component').then((mod=> mod.GuessGameComponent))},
  {path: 'contact', loadComponent: () => import('./pages/contact/contact.component').then((mod=> mod.ContactComponent))},
  {path: 'auth/login',  data: {mode: 'login'}, loadComponent: () => import('./pages/authentication/login/login.component').then((mod=> mod.LoginComponent))},
  {path: 'auth/register',  data: {mode: 'register'}, loadComponent: () => import('./pages/authentication/login/login.component').then((mod=> mod.LoginComponent))},
  {path: 'auth/password-reset',  data: {mode: 'password-reset'}, loadComponent: () => import('./pages/authentication/login/login.component').then((mod=> mod.LoginComponent))},
  {path: '**', loadComponent: () => import('./core/not-found/not-found.component').then((mod=> mod.NotFoundComponent))},
];
