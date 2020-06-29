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
     * Set the target position
     * @param {Point} evt - the target position
     * @param {number} t - the current time, in seconds
     * @param {number} dt - the amount of time to take to transition, in seconds
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

