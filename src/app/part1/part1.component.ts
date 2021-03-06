import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { MathService } from 'src/app/math.service';
import { fromEvent } from 'rxjs';
import { switchMap, takeUntil, pairwise } from 'rxjs/operators';
@Component({
  selector: 'app-part1',
  templateUrl: './part1.component.html',
  styleUrls: ['./part1.component.scss']
})
export class Part1Component implements AfterViewInit {

  @ViewChild('canvas') canvas: ElementRef | any;
  private ctx: CanvasRenderingContext2D | any;
  squares: any = [];
  blueSq: any = [];
  endpt: any;
  center: any;
  cursorPos: any;
  radius: any;

  constructor(public mathService: MathService) {
  }

  ngAfterViewInit(): void {
    const canvasEl: HTMLCanvasElement = this.canvas?.nativeElement;
    this.ctx = canvasEl.getContext('2d');
    this.drawGrid();
    this.captureEvents(canvasEl);
    let that = this;
    canvasEl.onmouseup = function (e) {
      that.endpt = true;
      that.drawBlueCircle();
    }
  }

  // captures all mousedown events from the canvas element
  private captureEvents(canvasEl: HTMLCanvasElement) {
    let setMousePos = true;
    fromEvent(canvasEl, 'mousedown')
      .pipe(switchMap(e => {
        this.endpt = false;
        setMousePos = true;
        // record all mouse moves after a mouse down
        return fromEvent(canvasEl, 'mousemove').pipe(
          // stop once the user releases the mouse (mouseup event)
          takeUntil(fromEvent(canvasEl, 'mouseup')),
          // also stop once the mouse leaves the canvas (mouseleave event)
          takeUntil(fromEvent(canvasEl, 'mouseleave')),
          // to get the previous value to set the value of 'center'
          pairwise()
        );
      })
      )
      .subscribe((res) => {
        const rect = canvasEl.getBoundingClientRect();
        const prevMouseEvent = res[0] as MouseEvent;
        const currMouseEvent = res[1] as MouseEvent;

        // previous and current position with the offset
        const prevPos = {
          x: prevMouseEvent.clientX - rect.left,
          y: prevMouseEvent.clientY - rect.top
        };

        const currentPos = {
          x: currMouseEvent.clientX - rect.left,
          y: currMouseEvent.clientY - rect.top
        };

        // The center needs to be set only once per event
        if (setMousePos) {
          this.center = prevPos;
          setMousePos = false;
        }
        this.cursorPos = currentPos
        this.drawBlueCircle();
      });
  }

  // Creates the default grid with gray squares
  drawGrid() {
    this.ctx.clearRect(0, 0, 400, 400);
    this.squares = [];
    for (let i = 0; i <= 400; i += 20) {
      for (let j = 0; j <= 400; j += 20) {
        this.ctx.fillStyle = "gray";
        this.ctx.fillRect(i, j, 5, 5);
        this.squares.push({
          'x': i,
          'y': j
        });
      }
    }
  }

  // re-creates the grid with blue squares and draws the red lineS
  fillGrid() {
    this.ctx.clearRect(0, 0, 400, 400);
    this.blueSq = [];
    for (let i = 0; i < this.squares.length; i++) {
      if (this.endpt) {
        if (this.isBlueSquare(i)) {
          this.ctx.fillStyle = "blue";
        } else {
          this.ctx.fillStyle = "gray";
        }
      } else {
        this.ctx.fillStyle = "gray";
      }
      this.ctx.fillRect(this.squares[i].x, this.squares[i].y, 5, 5);
    }
    if (this.endpt) {
      this.drawRedCircles();
    }
  }

  // draws the blue circle based on cursor inputs
  drawBlueCircle() {
    try {
      this.radius = this.mathService.getDist(this.center.x, this.center.y, this.cursorPos.x, this.cursorPos.y);
      this.fillGrid();
      this.ctx.beginPath();
      this.ctx.strokeStyle = "blue";
      this.ctx.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI);
      this.ctx.stroke();
    } catch (error) {
    }
    return;
  }

  // checks if a square is supposed to marked blue - determined based on proximity to circle
  isBlueSquare(index: any) {
    let point;
    // check points in all possible angles 
    for (let k = 0; k < 360; k += 5) {
      let angle = k * (Math.PI / 180);
      point = {
        'x': this.center.x + (Math.cos(angle) * this.radius),
        'y': this.center.y + (Math.sin(angle) * this.radius)
      }
      if (this.mathService.isPointNearCircle(point, this.squares[index])) {
        if (!this.blueSq.includes(this.squares[index])) {
          this.blueSq.push(this.squares[index]);
        }
        return true;
      }
    }
    return false;
  }

  // draws bounding red circles
  drawRedCircles() {
    let r1 = this.getOuterCircleRadius();
    let r2 = this.getInnerCircleRadius();
    // console.log(r1, r2);

    this.ctx.beginPath();
    this.ctx.strokeStyle = "red";
    this.ctx.arc(this.center.x, this.center.y, r1, 0, 2 * Math.PI);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.strokeStyle = "red";
    this.ctx.arc(this.center.x, this.center.y, r2, 0, 2 * Math.PI);
    this.ctx.stroke();

    return;
  }

  // return radius for the outer red circle - based on max dist between circle and a blue square
  getOuterCircleRadius() {
    let ans = this.radius;
    for (let i = 0; i < this.blueSq.length; i++) {
      ans = Math.max(ans, this.mathService.getDist(this.blueSq[i].x, this.blueSq[i].y, this.center.x, this.center.y));
    }
    return ans + 5; // +5 to adjust for the square size
  }


  // return radius for the inner red circle - based on min dist between circle and a blue square
  getInnerCircleRadius() {
    let ans = this.radius;
    for (let i = 0; i < this.blueSq.length; i++) {
      ans = Math.min(ans, this.mathService.getDist(this.blueSq[i].x, this.blueSq[i].y, this.center.x, this.center.y));
    }
    return ans - 5; // -5 to adjust for the square size
  }

}
