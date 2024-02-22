import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-pager',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    NgClass
  ],
  templateUrl: './pager.component.html',
  styleUrl: './pager.component.scss'
})
export class PagerComponent implements OnInit{
  @Input() itemCount = 100;
  @Input() itemsPerPage = 20;
  @Output() paging: EventEmitter<number> = new EventEmitter();
  pageCount = 0;
  pages: number[] = [];
  selectedPage = 1;
  dropDowned = false;
  ngOnInit() {
    this.pageCount =  Math.round(this.itemCount / this.itemsPerPage);
    for(let i = 1; i< this.pageCount+1; i++ ){
      this.pages.push(i);
    }
  }
  pageChange(selectedPage: number)
  {
    this.selectedPage = selectedPage;
    this.paging.emit(this.selectedPage);
  }
}
