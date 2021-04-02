import { isDefined } from "../typeChecks.js";
import { IPoint, Point } from "./point.js";
import { ISize, Size } from "./Size";

export interface IRectangle {
    point: IPoint;
    size: ISize;
}

export class Rectangle implements IRectangle {
    point: Point;
    size: Size;
    constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
        this.point = new Point(x, y);
        this.size = new Size(width, height);
        Object.freeze(this);
    }

    get x() {
        return this.point.x;
    }

    set x(x) {
        this.point.x = x;
    }

    get left() {
        return this.point.x;
    }
    set left(x) {
        this.point.x = x;
    }

    get width() {
        return this.size.width;
    }
    set width(width) {
        this.size.width = width;
    }

    get right() {
        return this.point.x + this.size.width;
    }
    set right(right) {
        this.point.x = right - this.size.width;
    }

    get y() {
        return this.point.y;
    }
    set y(y) {
        this.point.y = y;
    }

    get top() {
        return this.point.y;
    }
    set top(y) {
        this.point.y = y;
    }

    get height() {
        return this.size.height;
    }
    set height(height) {
        this.size.height = height;
    }

    get bottom() {
        return this.point.y + this.size.height;
    }
    set bottom(bottom) {
        this.point.y = bottom - this.size.height;
    }

    get area() {
        return this.width * this.height;
    }

    set(x: number, y: number, width: number, height: number) {
        this.point.set(x, y);
        this.size.set(width, height);
    }

    copy(r: Rectangle) {
        if (isDefined(r)) {
            this.point.copy(r.point);
            this.size.copy(r.size);
        }
    }

    clone() {
        return new Rectangle(this.point.x, this.point.y, this.size.width, this.size.height);
    }

    overlap(r: Rectangle) {
        const left = Math.max(this.left, r.left),
            top = Math.max(this.top, r.top),
            right = Math.min(this.right, r.right),
            bottom = Math.min(this.bottom, r.bottom);
        if (right > left && bottom > top) {
            return new Rectangle(left, top, right - left, bottom - top);
        }
        else {
            return null;
        }
    }

    toString() {
        return `[${this.point.toString()} x ${this.size.toString()}]`;
    }
}
