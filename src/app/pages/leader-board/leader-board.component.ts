import {Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {UserService} from "../../shared/services/user.service";
import {LeaderBoardItem} from "../../shared/interfaces/leader-board";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
interface LeaderParams{
  type: string;
}
@Component({
  selector: 'app-leader-board',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './leader-board.component.html',
  styleUrl: './leader-board.component.scss',
  providers: [UserService]
})
export class LeaderBoardComponent implements OnInit{
  selectedTab = 'Daily';
  leaderBoard: LeaderBoardItem[] = [];
  constructor(private userService: UserService,
              private router: Router,
              private actr: ActivatedRoute) {
  }
  ngOnInit(): void {
    const params = this.actr.snapshot.queryParams;
    if(!Object.keys(params).length){
      const queryParams: NavigationExtras = {
        queryParams: { type: 'daily'},
        queryParamsHandling: 'merge',
        replaceUrl: true
      };
      this.router.navigate([], queryParams);

    }
    this.actr.queryParams.subscribe((res)=>{
    const type = (res as LeaderParams).type;
      this.userService.getLeaderBoard(type).subscribe((leaderBoard)=>{
        this.leaderBoard = leaderBoard;
      })
    })
  }

  selectTab(event: MouseEvent){
    const target = event.target as HTMLElement;
    if(!target.textContent) return;
    const text = target.textContent.trim();
    if(this.selectedTab == text) return;
    this.selectedTab = text;
    const queryParams: NavigationExtras = {
      queryParams: { type: text},
      queryParamsHandling: 'merge',
      replaceUrl: true
    };
    this.router.navigate([], queryParams);

  }



}
