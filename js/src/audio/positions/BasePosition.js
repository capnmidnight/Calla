export class BasePosition {
    /** 
     *  The horizontal component of the position.
     *  @type {number} */
    get x() {
        throw new Error("Not implemented in base class.");
    }

    /** 
     *  The vertical component of the position.
     *  @type {number} */
    get y() {
        throw new Error("Not implemented in base class.");
    }

/**
 * Set the target position for the time `t + dt`.
 * @param {UserPosition} evt
 * @param {number} t
 * @param {number} dt
 */
    setTarget(evt, t, dt) {
        throw new Error("Not implemented in base class.");
    }

    /**
     * Update the position.
     * @param {number} t - the current time, in seconds
     */
    update(t) {
    }
}

