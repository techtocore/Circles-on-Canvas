import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { MathService } from 'src/app/math.service';
@Component({
  selector: 'app-part2',
  templateUrl: './part2.component.html',
  styleUrls: ['./part2.component.scss']
})
export class Part2Component implements AfterViewInit {

  @ViewChild('canvas') canvas: ElementRef | any;
  private ctx: CanvasRenderingContext2D | any;
  squares: any = [];
  blueSq: any = [];
  center: any;
  cursorPos: any;
  radius: any;

  constructor(public mathService: MathService) {
  }

  ngAfterViewInit(): void {
    const canvasEl: HTMLCanvasElement = this.canvas?.nativeElement;
    this.ctx = canvasEl.getContext('2d');
    this.drawGrid();
    let that = this;
    canvasEl.onmousedown = function (e) {
      that.blueSq.push({
        x: e.offsetX,
        y: e.offsetY
      });
      that.fillGrid();
    }
  }


  // Creates the default grid with gray squares
  drawGrid() {
    this.ctx.clearRect(0, 0, 400, 400);
    this.squares = [];
    for (let i = 0; i <= 400; i += 24) {
      for (let j = 0; j <= 400; j += 24) {
        this.ctx.fillStyle = "gray";
        this.ctx.fillRect(i, j, 8, 8);
        this.squares.push({
          'x': i,
          'y': j
        });
      }
    }
  }

  fillGrid() {
    this.ctx.clearRect(0, 0, 400, 400);
    for (let i = 0; i < this.squares.length; i++) {
        if (this.isBlueSquare(i)) {
          this.ctx.fillStyle = "blue";
        } else {
          this.ctx.fillStyle = "gray";
        }

      this.ctx.fillRect(this.squares[i].x, this.squares[i].y, 8, 8);
    }
  }

  drawBlueCircle() {
    this.fillGrid();
    this.radius = this.mathService.getDist(this.center.x, this.center.y, this.cursorPos.x, this.cursorPos.y);

    this.ctx.beginPath();
    this.ctx.strokeStyle = "blue";
    this.ctx.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI);
    this.ctx.stroke();
    return;
  }

  isBlueSquare(index: any) {
    let x = this.squares[index].x;
    let y = this.squares[index].y;
    for(let i = 0; i < this.blueSq.length; i++) {
      if (this.mathService.isPointNearCircle(this.blueSq[i], this.squares[index])) {
        return true;
      }
    }
    return false;
  }

}
