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

    this.processPoints();

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

  // naive method degenerate cases
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

  // naive method degenerate cases
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

  linearSolve2x2(matrix: any, vector: any) {
    var det = matrix[0] * matrix[3] - matrix[1] * matrix[2];
    if (det < 1e-8) return false; //no solution
    var y = (matrix[0] * vector[1] - matrix[2] * vector[0]) / det;
    var x = (vector[0] - matrix[1] * y) / matrix[0];
    return [x, y];
  }

  // Fit circle based on Least-Squares method
  processPoints() {
    let points = this.actualBlueSquares;
    var result: any = {
      success: false,
      center: { x: 0, y: 0 },
      radius: 0,
    };

    // means
    var m = points.reduce(function (p: any, c: any) {
      return {
        x: p.x + c.x / points.length,
        y: p.y + c.y / points.length
      };
    }, { x: 0, y: 0 });

    // centered points
    var u = points.map(function (e: any) {
      return {
        x: e.x - m.x,
        y: e.y - m.y
      };
    });

    // solve linear equation
    var Sxx = u.reduce(function (p: any, c: any) {
      return p + c.x * c.x;
    }, 0);

    var Sxy = u.reduce(function (p: any, c: any) {
      return p + c.x * c.y;
    }, 0);

    var Syy = u.reduce(function (p: any, c: any) {
      return p + c.y * c.y;
    }, 0);

    var v1 = u.reduce(function (p: any, c: any) {
      return p + 0.5 * (c.x * c.x * c.x + c.x * c.y * c.y);
    }, 0);

    var v2 = u.reduce(function (p: any, c: any) {
      return p + 0.5 * (c.y * c.y * c.y + c.x * c.x * c.y);
    }, 0);

    // console.log([Sxx, Sxy, Sxy, Syy], [v1, v2]);
    var sol = this.linearSolve2x2([Sxx, Sxy, Sxy, Syy], [v1, v2]);

    if (sol === false) {
      //not enough points / points are colinears
      return result;
    }

    result.success = true;

    //compute radius from circle equation
    var radius2 = sol[0] * sol[0] + sol[1] * sol[1] + (Sxx + Syy) / points.length;
    result.radius = Math.sqrt(radius2);

    result.center.x = sol[0] + m.x;
    result.center.y = sol[1] + m.y;
    console.log(result);

    this.center = result.center;
    this.radius = result.radius;

  }

}
