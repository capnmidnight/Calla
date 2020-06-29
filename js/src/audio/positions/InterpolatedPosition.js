import { project } from "../math.js";
import { BasePosition } from "./BasePosition.js";

export class InterpolatedPosition extends BasePosition {

    constructor() {
        super();

        this._st
            = this._et
            = 0;
        this._x
            = this._tx
            = this._sx
            = 0;
        this._y
            = this._ty
            = this._sy
            = 0;
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    setTarget(evt, t, dt) {
        this._st = t;
        this._et = t + dt;
        this._sx = this._x;
        this._sy = this._y;
        this._tx = evt.x;
        this._ty = evt.y;
    }

    update(t) {
        const p = project(t, this._st, this._et);
        if (p <= 1) {
            const deltaX = this._tx - this._sx,
                deltaY = this._ty - this._sy;
            this._x = this._sx + p * deltaX;
            this._y = this._sy + p * deltaY;
        }
    }
}

