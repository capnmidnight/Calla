import { WebAudioNewNodePosition } from "./WebAudioNewNodePosition.js";

/**
 * A positioner that uses WebAudio's playback dependent time progression.
 **/
export class WebAudioNewListenerPosition extends WebAudioNewNodePosition {
    /**
     * Creates a new positioner that uses WebAudio's playback dependent time progression.
     * @param {AudioListener} node - the audio node that will receive the position value.
     * @param {boolean} forceInterpolation - when set to true, circumvents WebAudio's time tracking and uses our own.
     */
    constructor(node, forceInterpolation) {
        super(node, forceInterpolation);
        this.node.forwardX.setValueAtTime(0, 0);
        this.node.forwardY.setValueAtTime(0, 0);
        this.node.forwardZ.setValueAtTime(-1, 0);
        this.node.upX.setValueAtTime(0, 0);
        this.node.upY.setValueAtTime(1, 0);
        this.node.upZ.setValueAtTime(0, 0);
    }
}
