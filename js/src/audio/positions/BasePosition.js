/** @type {WeakMap<BasePosition, BasePositionPrivate>} */
const selfs = new WeakMap();

class BasePositionPrivate {
    constructor() {
        this.tx = 0;
        this.ty = 0;
        this.tz = 0;
    }

    /**
     * 
     * @param {number} x
     * @param {number} y
     * @param {number} z
     */
    set(x, y, z) {
        this.tx = x;
        this.ty = y;
        this.tz = z;
    }
}

export class BasePosition {
    constructor() {
        selfs.set(this, new BasePositionPrivate());
    }

    /**
     * 
     * @param {BasePosition} other
     */
    copy(other) {
        const self = selfs.get(this);
        self.tx = other.tx;
        self.ty = other.ty;
        self.tz = other.tz;
    }

    get tx() {
        return selfs.get(this).tx;
    }

    get ty() {
        return selfs.get(this).ty;
    }

    get tz() {
        return selfs.get(this).tz;
    }

    /** 
     *  The horizontal component of the position.
     *  @type {number} */
    get x() {
        return this.tx;
    }

    /** 
     *  The vertical component of the position.
     *  @type {number} */
    get y() {
        return this.ty;
    }

    /** 
     *  The lateral component of the position.
     *  @type {number} */
    get z() {
        return this.tz;
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
        selfs.get(this).set(x, y, z);
    }

    /**
     * Update the position.
     * @param {number} t - the current time, in seconds
     */
    update(t) {
    }
}

