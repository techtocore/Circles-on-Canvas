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
    this.actualBlueSquares = [];
    this.blueSq = [];
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

    if (this.actualBlueSquares.length === 3) {
      this.processThreePoints();
    }

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

  processThreePoints() {
    let x1 = this.actualBlueSquares[0].x;
    let y1 = this.actualBlueSquares[0].y;
    let x2 = this.actualBlueSquares[1].x;
    let y2 = this.actualBlueSquares[1].y;
    let x3 = this.actualBlueSquares[2].x;
    let y3 = this.actualBlueSquares[2].y;

    let x12 = (x1 - x2);
    let x13 = (x1 - x3);
    let y12 = (y1 - y2);
    let y13 = (y1 - y3);
    let y31 = (y3 - y1);
    let y21 = (y2 - y1);
    let x31 = (x3 - x1);
    let x21 = (x2 - x1);

    //x1^2 - x3^2
    let sx13 = Math.pow(x1, 2) - Math.pow(x3, 2);

    // y1^2 - y3^2
    let sy13 = Math.pow(y1, 2) - Math.pow(y3, 2);

    let sx21 = Math.pow(x2, 2) - Math.pow(x1, 2);
    let sy21 = Math.pow(y2, 2) - Math.pow(y1, 2);

    let f = ((sx13) * (x12)
      + (sy13) * (x12)
      + (sx21) * (x13)
      + (sy21) * (x13))
      / (2 * ((y31) * (x12) - (y21) * (x13)));
    let g = ((sx13) * (y12)
      + (sy13) * (y12)
      + (sx21) * (y13)
      + (sy21) * (y13))
      / (2 * ((x31) * (y12) - (x21) * (y13)));

    let c = -(Math.pow(x1, 2)) -
      Math.pow(y1, 2) - 2 * g * x1 - 2 * f * y1;

    // eqn of circle is
    // x^2 + y^2 + 2*g*x + 2*f*y + c = 0
    // where centre is (x = -g, y = -f) and radius r
    // as r^2 = h^2 + k^2 - c
    let x = -g;
    let y = -f;
    let sqr_of_r = x * x + y * y - c;

    // r is the radius
    if (!isNaN(sqr_of_r)) {
      this.radius = Math.sqrt(sqr_of_r);
      this.center = {
        'x': x,
        'y': y
      };
    }
  }
}
