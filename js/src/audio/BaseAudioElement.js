import { BasePosition } from "./positions/BasePosition.js";

/**
 * A base class for positioned audio elements.
 **/
export class BaseAudioElement extends EventTarget {
    /**
     * Creates a new positioned audio element.
     * @param {BasePosition} position
     */
    constructor(position) {
        super();

        this.minDistance = 1;
        this.minDistanceSq = 1;
        this.maxDistance = 10;
        this.maxDistanceSq = 100;
        this.rolloff = 1;
        this.transitionTime = 0.5;

        /** @type {BasePosition} */
        this.position = position;
    }

    /**
     * Sets parameters that alter spatialization.
     * @param {number} minDistance
     * @param {number} maxDistance
     * @param {number} rolloff
     * @param {number} transitionTime
     */
    setAudioProperties(minDistance, maxDistance, rolloff, transitionTime) {
        this.minDistance = minDistance;
        this.maxDistance = maxDistance;
        this.transitionTime = transitionTime;
        this.rolloff = rolloff;
    }

    /**
     * Gets the current playback time from the audio context.
     * @returns {number}
     */
    get currentTime() {
        throw new Error("Not implemented in base class");
    }

    /**
     * Set the target position
     * @param {number} x - the horizontal component of the position.
     * @param {number} y - the vertical component of the position.
     * @param {number} z - the lateral component of the position.
     */
    setPosition(x, y, z) {
        if (this.position) {
            this.position.setTarget(x, y, z, this.currentTime, this.transitionTime);
            this.update();
        }
    }

    /**
     * Performs position updates.
     **/
    update() {
        if (this.position) {
            this.position.update(this.currentTime);
        }
    }
}