import {AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {NgForOf} from "@angular/common";
import {Words} from "../../../interfaces/words.inteface";

@Component({
  selector: 'app-image-quiz',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './image-quiz.component.html',
  styleUrl: './image-quiz.component.scss'
})
export class ImageQuizComponent implements OnChanges {
  @Input() image: string = 'https://img.youtube.com/vi/gY5nDXOtv_o/hqdefault.jpg';
  @Input() time = 0;
  imageData: any = null;
  cubes: number[] = [];
  cubeColors: string[] =[];


  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if(changes['image']){
   await this.toDataURL(this.image);
      this.cubes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39];
      this.cubeColors = ['black', 'black', 'black', 'black', 'black',
        'black', 'black', 'black', 'black', 'black', 'black', 'black',
        'black', 'black', 'black', 'black', 'black', 'black', 'black', 'black',
        'black', 'black', 'black', 'black', 'black',
        'black', 'black', 'black', 'black', 'black', 'black', 'black',
        'black', 'black', 'black', 'black', 'black', 'black', 'black', 'black']
      this.shuffleArray(this.cubes);
    }
    if(this.time ===0) return;
    this.cubeColors[this.cubes.shift() as number] = 'transparent';
    this.cubeColors[this.cubes.pop() as number] = 'transparent';
    if(this.time ==20){
      this.imageData = null;
    }
  }
   toDataURL(url: string) {
    fetch(url)
       .then(response => response.blob())
       .then(blob => new Promise((resolve, reject) => {
         const reader = new FileReader()
         reader.onloadend = () => resolve(this.imageData = reader.result)
         reader.onerror = reject
         reader.readAsDataURL(blob)
       }))
   }

  shuffleArray(array: number[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

}
