export class BaseAudioElement extends EventTarget {
    /**
     * 
     * @param {BasePosition} position
     */
    constructor(position) {
        super();

        this.minDistance = 1;
        this.maxDistance = 10;
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

    get currentTime() {
        throw new Error("Not implemented in base class");
    }

    /**
     * Set the target position
     * @param {Point} evt
     */
    setTarget(evt) {
        if (this.position) {
            this.position.setTarget(evt, this.currentTime, this.transitionTime);
            this.update();
        }
    }

    update() {
        if (this.position) {
            this.position.update(this.currentTime);
        }
    }
}