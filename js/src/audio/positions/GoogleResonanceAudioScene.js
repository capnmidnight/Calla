/* global ResonanceAudio */

import { InterpolatedPosition } from "./InterpolatedPosition.js";
import "../../../lib/resonance-audio.js";

/**
 * An audio positioner that uses Google's Resonance Audio library
 **/
export class GoogleResonanceAudioScene extends InterpolatedPosition {
    /**
     * Creates a new audio positioner that uses Google's Resonance Audio library
     * @param {AudioContext} audioContext
     */
    constructor(audioContext) {
        super();

        this.scene = new ResonanceAudio(audioContext, {
            ambisonicOrder: 3
        });
        this.scene.output.connect(audioContext.destination);

        this.position = new InterpolatedPosition();

        this.scene.setRoomProperties({
            width: 10,
            height: 5,
            depth: 10,
        }, {
            left: "transparent",
            right: "transparent",
            front: "transparent",
            back: "transparent",
            down: "grass",
            up: "transparent",
        });
    }

    /**
     * Updates the Resonance Audio scene with the latest position.
     * @protected
     * @param {number} t
     */
    update(t) {
        super.update(t);
        this.scene.setListenerPosition(this.x, 0, this.y);
    }
}
