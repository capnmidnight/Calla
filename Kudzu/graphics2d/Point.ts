import { isDefined } from "../typeChecks";
import type { Rectangle } from "./Rectangle";

export class Point {
    constructor(public x: number = 0, public y: number = 0) {
        Object.seal(this);
    }

    set(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    copy(p: Point) {
        if (isDefined(p)) {
            this.x = p.x;
            this.y = p.y;
        }
    }

    toCell(character: Rectangle, scroll: Point, gridBounds: Rectangle) {
        this.x = Math.round(this.x / character.width) + scroll.x - gridBounds.x;
        this.y = Math.floor((this.y / character.height) - 0.25) + scroll.y;
    }

    inBounds(bounds: Rectangle) {
        return bounds.left <= this.x
            && this.x < bounds.right
            && bounds.top <= this.y
            && this.y < bounds.bottom;
    }

    clone() {
        return new Point(this.x, this.y);
    }

    toString() {
        return `(x:${this.x}, y:${this.y})`;
    }
}
