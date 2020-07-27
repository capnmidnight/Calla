import { clamp, lerp, project } from "../../math.js";
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

        /** @type {number} */
        this._st = 0;

        /** @type {number} */
        this._et = 0;

        /** @type {number} */
        this._x = 0;

        /** @type {number} */
        this._sx = 0;

        /** @type {number} */
        this._y = 0;

        /** @type {number} */
        this._sy = 0;

        /** @type {number} */
        this._z = 0;

        /** @type {number} */
        this._sz = 0;
    }

    /**
     *  The horizontal component of the position.
     *  @type {number}
     **/
    get x() {
        return this._x;
    }

    /**
     *  The vertical component of the position.
     *  @type {number}
     **/
    get y() {
        return this._y;
    }

    /**
     * The lateral component of the position.
     * @type {number}
     **/
    get z() {
        return this._z;
    }

    copy(other) {
        super.copy(other);
        this._x = other.x;
        this._y = other.y;
        this._z = other.z;
    }

    /**
     * Set the target position for the time `t + dt`.
     * @param {number} x - the horizontal component of the position.
     * @param {number} y - the vertical component of the position.
     * @param {number} z - the lateral component of the position.
     * @param {number} t - the time at which to start the transition.
     * @param {number} dt - the amount of time to take making the transition.
     */
    setTarget(x, y, z, t, dt) {
        super.setTarget(x, y, z, t, dt);
        this._st = t;
        this._et = t + dt;
        this._sx = this._x;
        this._sy = this._y;
        this._sz = this._z;
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
            this._x = lerp(this._sx, this.tx, q);
            this._y = lerp(this._sy, this.ty, q);
            this._z = lerp(this._sz, this.tz, q);
        }
        else {
            this._x = this._sx = this.tx;
            this._y = this._sy = this.ty;
            this._z = this._sz = this.tz;
        }
    }
}

