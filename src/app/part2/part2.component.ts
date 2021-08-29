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
  blueSq: any = []; // user selected coordinates
  actualBlueSquares: any = []; // for actual squares to be colored
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
    this.getCenter();
    this.getRadius();

    this.ctx.beginPath();
    this.ctx.strokeStyle = "blue";
    this.ctx.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI);
    this.ctx.stroke();
    return;
  }

  isBlueSquare(index: any) {
    let x = this.squares[index].x;
    let y = this.squares[index].y;
    for (let i = 0; i < this.blueSq.length; i++) {
      if (this.mathService.isPointNearCircle(this.blueSq[i], this.squares[index])) {
        return true;
      }
    }
    return false;
  }

  getCenter() {
    let sumx = 0, sumy = 0
    let blueSquares = [];
    for (let i = 0; i < this.squares.length; i++) {
      if (this.isBlueSquare(i)) {
        blueSquares.push(this.squares[i]);
      }
    }
    for (let i = 0; i < blueSquares.length; i++) {
      sumx += blueSquares[i].x;
      sumy += blueSquares[i].y;
    }
    this.actualBlueSquares = blueSquares;
    let x = (sumx / blueSquares.length);
    let y = (sumy / blueSquares.length);
    this.center = {
      'x': x,
      'y': y
    };
    return;
  }

  getRadius() {
    let distances = [];
    for (let i = 0; i < this.actualBlueSquares.length; i++) {
      let dist = this.mathService.getDist(this.actualBlueSquares[i].x, this.actualBlueSquares[i].y, this.center.x, this.center.y);
      distances.push(dist);
    }
    let sum = 0;
    for (let i = 0; i < distances.length; i++) {
      sum += distances[i];
    }
    this.radius = (sum / distances.length);
    return;

  }

}
