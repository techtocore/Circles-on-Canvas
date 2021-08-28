import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
@Component({
  selector: 'app-part1',
  templateUrl: './part1.component.html',
  styleUrls: ['./part1.component.scss']
})
export class Part1Component implements AfterViewInit {

  @ViewChild('canvas') canvas: ElementRef | any;
  private ctx: CanvasRenderingContext2D | any;
  squares: any = [];
  
  constructor() {
  }

  ngAfterViewInit(): void {
    const canvasEl: HTMLCanvasElement = this.canvas?.nativeElement;
    this.ctx = canvasEl.getContext('2d');
    this.drawGrid();
  }

  // Creates the default grid with gray squares
  drawGrid() {
    for (let i = 0; i <= 400; i += 20) {
      for (let j = 0; j <= 400; j += 20) {
        this.squares.push({
          'x': i,
          'y': j
        });
        this.ctx.fillStyle = "gray";
        this.ctx.fillRect(i, j, 5, 5);
      }
    }
  }

}
