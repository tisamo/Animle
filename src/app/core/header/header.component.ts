import { Component } from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {NgIf} from "@angular/common";
import {AuthService} from "../../shared/services/auth.service";
import {SimpleResponse} from "../../shared/interfaces/simple-response";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    NgIf
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  navMenuVisible  = false;
  constructor(public authService: AuthService,
              private router: Router) {
    this.authService.isSignedIn().subscribe((res: SimpleResponse)=>{
      this.authService.isAuthenticated = true;
      this.authService.userName = res.response;
    })
  }
  logOut() {
    this.authService.isAuthenticated = false;
    this.navMenuVisible = false;
    localStorage.removeItem('jwt');
    this.router.navigate(['/']);
  }
}
