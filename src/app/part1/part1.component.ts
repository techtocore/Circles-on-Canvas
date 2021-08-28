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
  }

  // Captures all mousedown events from the canvas element
  private captureEvents(canvasEl: HTMLCanvasElement) {
    let setMousePos = true;
    fromEvent(canvasEl, 'mousedown')
      .pipe(switchMap(e => {
        setMousePos = true;
        // record all mouse moves after a mouse down
        return fromEvent(canvasEl, 'mousemove').pipe(
          // stop once the user releases the mouse (mouseup event)
          takeUntil(fromEvent(canvasEl, 'mouseup')),
          // also stop (and unsubscribe) once the mouse leaves the canvas (mouseleave event)
          takeUntil(fromEvent(canvasEl, 'mouseleave')),
          // pairwise lets us get the previous value to set the value of 'center'
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

  drawBlueCircle() {
    this.drawGrid();
    // console.log(this.cursorPos);
    this.radius = this.mathService.getDist(this.center.x, this.center.y, this.cursorPos.x, this.cursorPos.y);

    this.ctx.beginPath();
    this.ctx.strokeStyle = "blue";
    this.ctx.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI);
    this.ctx.stroke();
    return;
  }
}
