import { isDefined } from "../typeChecks";
export class Point {
    x;
    y;
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
        Object.seal(this);
    }
    set(x, y) {
        this.x = x;
        this.y = y;
    }
    copy(p) {
        if (isDefined(p)) {
            this.x = p.x;
            this.y = p.y;
        }
    }
    toCell(character, scroll, gridBounds) {
        this.x = Math.round(this.x / character.width) + scroll.x - gridBounds.x;
        this.y = Math.floor((this.y / character.height) - 0.25) + scroll.y;
    }
    inBounds(bounds) {
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
//# sourceMappingURL=Point.js.map