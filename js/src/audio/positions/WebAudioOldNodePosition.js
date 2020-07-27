import { InterpolatedPosition } from "./InterpolatedPosition.js";

/**
 * A positioner that uses the WebAudio API's old setPosition method.
 **/
export class WebAudioOldNodePosition extends InterpolatedPosition {

    /**
     * Creates a new positioner that uses the WebAudio API's old setPosition method.
     * @param {PannerNode|AudioListener} node - the listener on the audio context.
     */
    constructor(node) {
        super();

        this.node = node;

        this.node.setPosition(0, 0, 0);
        this.node.setOrientation(0, 0, -1, 0, 1, 0);
    }

    /**
     * Calculates the new position for the given time.
     * @protected
     * @param {number} t
     */
    update(t) {
        super.update(t);
        this.node.setPosition(this.x, this.y, this.z);
    }
}
