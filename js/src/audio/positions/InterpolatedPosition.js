import { project, lerp } from "../../math.js";
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

    /** @type {number} */
    get x() {
        return this._x;
    }

    /** @type {number} */
    get y() {
        return this._y;
    }

    /**
     * 
     * @param {UserPosition} evt
     * @param {number} t
     * @param {number} dt
     */
    setTarget(evt, t, dt) {
        this._st = t;
        this._et = t + dt;
        this._sx = this._x;
        this._sy = this._y;
        this._tx = evt.x;
        this._ty = evt.y;
    }

    /**
     * 
     * @param {number} t
     */
    update(t) {
        const p = project(t, this._st, this._et);
        if (p <= 1) {
            this._x = lerp(this._sx, this._tx, p);
            this._y = lerp(this._sy, this._ty, p);
        }
    }
}

