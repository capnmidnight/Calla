/* global ResonanceAudio */

import "../../../../lib/resonance-audio.js";
import { Pose } from "../../positions/Pose.js";
import { ResonanceSource } from "../sources/ResonanceSource.js";
import { BaseListener } from "./BaseListener.js";

/**
 * An audio positioner that uses Google's Resonance Audio library
 **/
export class ResonanceScene extends BaseListener {
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

        Object.seal(this);
    }

    /**
     * Performs the spatialization operation for the audio source's latest location.
     * @param {Pose} loc
     */
    update(loc) {
        super.update(loc);
        const { p, f, u } = loc;
        this.scene.setListenerPosition(p.x, p.y, p.z);
        this.scene.setListenerOrientation(f.x, f.y, f.z, u.x, u.y, u.z);
    }

    /**
     * Creates a spatialzer for an audio source.
     * @private
     * @param {string} id
     * @param {MediaStream|HTMLAudioElement} stream - the audio element that is being spatialized.
     * @param {number} bufferSize - the size of the analysis buffer to use for audio activity detection
     * @param {AudioContext} audioContext
     * @param {Pose} dest
     * @return {BaseSource}
     */
    createSource(id, stream, bufferSize, audioContext, dest) {
        return new ResonanceSource(id, stream, bufferSize, audioContext, this.scene);
    }
}
