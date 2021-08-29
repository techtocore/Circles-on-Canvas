import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MathService {

  constructor() { }

  getDist(x1: number, y1: number, x2: number, y2: number) {
    return Math.hypot(x1 - x2, y1 - y2);
  }

  // checks if a square is with a certain distance of the cicle.
  // the number '10' is determined by the size of the square
  isPointNearCircle(point: any, square: any) {
    if (Math.abs(point.x - square.x) < 10 && Math.abs(point.y - square.y) < 10) {
      return true;
    }
    return false;
  }
}
