import { InterpolatedPosition } from "./InterpolatedPosition.js";

/**
 * A positioner that uses the WebAudio API's old setPosition method.
 **/
export class WebAudioOldListenerPosition extends InterpolatedPosition {

    /**
     * Creates a new positioner that uses the WebAudio API's old setPosition method.
     * @param {AudioListener} listener - the listener on the audio context.
     */
    constructor(listener) {
        super();

        this.listener = listener;
        this.listener.setPosition(0, 0, 0);
        this.listener.setOrientation(0, 0, -1, 0, 1, 0);
    }

    /**
     * Calculates the new position for the given time.
     * @protected
     * @param {number} t
     */
    update(t) {
        super.update(t);
        this.listener.setPosition(this.x, 0, this.y);
    }
}
