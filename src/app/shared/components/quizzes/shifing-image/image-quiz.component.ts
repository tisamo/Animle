import {AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {NgForOf} from "@angular/common";
import {Words} from "../../../interfaces/words.inteface";
import {opacity} from "../../../animations/animations";
import {interval} from "rxjs";

@Component({
  selector: 'app-shifting-image',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './image-quiz.component.html',
  styleUrl: './image-quiz.component.scss',
  animations: [opacity]
})
export class ShiftingImage implements OnInit, OnChanges {
  @Input() image: string = 'https://img.youtube.com/vi/gY5nDXOtv_o/hqdefault.jpg';
  @Input() time = 0;
  displayedPieces: string[] = [];
  everyPiece: string[] = [];

  ngOnInit(): void {}
  shuffleInterval: any;
  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if(changes['image']){
      if(this.shuffleInterval){
      this.shuffleInterval.unsubscribe();
      }
      this.displayedPieces = [];
      this.everyPiece = [];
      const img: HTMLImageElement = new Image();
      img.crossOrigin="anonymous";
      img.onload = (e) => {
      const canvas = document.createElement('canvas');
       let  ctx = canvas.getContext('2d');
       if(!ctx){
         return
       }
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const pieceWidth = img.width / 4;
        const pieceHeight = img.height / 4;

        for (let x = 0; x < img.width; x += pieceWidth) {
          for (let y = 0; y < img.height; y += pieceHeight) {
            const slice = document.createElement("canvas");
            slice.width = pieceWidth;
            slice.height = pieceHeight;
            const sliceCtx = slice.getContext("2d");
            if(!sliceCtx){
              return;
            }
            sliceCtx.drawImage(canvas, x, y, pieceWidth, pieceHeight, 0, 0, pieceWidth, pieceHeight);
            const dataURL = slice.toDataURL("image/png");
            this.everyPiece.push(dataURL);
          }
        }
        this.shuffleArray(this.everyPiece);
        this.displayedPieces = this.everyPiece.slice(0,4);
        let imageToChange = 0;
        this.shuffleInterval = interval(400).subscribe(()=>{
          if(imageToChange === 4){
            imageToChange = 0;
          }
          let randomlySelectedIndex = Math.floor(Math.random()* this.everyPiece.length);
          while(this.displayedPieces.includes(this.everyPiece[randomlySelectedIndex])){
            randomlySelectedIndex = Math.floor(Math.random()* this.everyPiece.length);
          }
          this.displayedPieces[imageToChange] = this.everyPiece[randomlySelectedIndex];
          imageToChange++;
        });
      }
      img.src = this.image;
    }
    if(this.time ===0) return;

  }


  shuffleArray(array: Array<any>) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

}
