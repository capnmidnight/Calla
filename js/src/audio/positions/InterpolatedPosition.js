import { project, lerp, clamp } from "../../math.js";
import { BasePosition } from "./BasePosition.js";

/**
 * A position value that is blended from the current position to
 * a target position over time.
 */
export class InterpolatedPosition extends BasePosition {

    /**
     * Creates a new position value that is blended from the current position to
     * a target position over time.
     **/
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

    /**
     *  The horizontal component of the position.
     *  @type {number} */
    get x() {
        return this._x;
    }

    /**
     *  The vertical component of the position.
     *  @type {number} */
    get y() {
        return this._y;
    }

    /**
     * Set the target position for the time `t + dt`.
     * @param {number} x - the horizontal component of the position.
     * @param {number} y - the vertical component of the position.
     * @param {number} t
     * @param {number} dt
     */
    setTarget(x, y, t, dt) {
        this._st = t;
        this._et = t + dt;
        this._sx = this._x;
        this._sy = this._y;
        this._tx = x;
        this._ty = y;
    }

    /**
     * Calculates the new position for the given time.
     * @protected
     * @param {number} t
     */
    update(t) {
        if (this._st !== this._et) {
            const p = project(t, this._st, this._et);
            const q = clamp(p, 0, 1);
            this._x = lerp(this._sx, this._tx, q);
            this._y = lerp(this._sy, this._ty, q);
        }
        else {
            this._x = this._sx = this._tx;
            this._y = this._sy = this._ty;
        }
    }
}

