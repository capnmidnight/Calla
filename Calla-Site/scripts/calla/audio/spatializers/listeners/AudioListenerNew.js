import { Pose } from "../../positions/Pose.js";
import { PannerNew } from "../sources/PannerNew.js";
import { AudioListenerBase } from "./AudioListenerBase.js";

/**
 * A positioner that uses WebAudio's playback dependent time progression.
 **/
export class AudioListenerNew extends AudioListenerBase {
    /**
     * Creates a new positioner that uses WebAudio's playback dependent time progression.
     * @param {AudioListener} listener
     */
    constructor(listener) {
        super(listener);

        Object.seal(this);
    }

    /**
     * Performs the spatialization operation for the audio source's latest location.
     * @param {Pose} loc
     */
    update(loc) {
        super.update(loc);
        const { p, f, u } = loc;
        this.node.positionX.setValueAtTime(p.x, 0);
        this.node.positionY.setValueAtTime(p.y, 0);
        this.node.positionZ.setValueAtTime(p.z, 0);
        this.node.forwardX.setValueAtTime(f.x, 0);
        this.node.forwardY.setValueAtTime(f.y, 0);
        this.node.forwardZ.setValueAtTime(f.z, 0);
        this.node.upX.setValueAtTime(u.x, 0);
        this.node.upY.setValueAtTime(u.y, 0);
        this.node.upZ.setValueAtTime(u.z, 0);
    }


    /**
     * Creates a spatialzer for an audio source.
     * @private
     * @param {string} id
     * @param {MediaStream|HTMLAudioElement} stream - the audio element that is being spatialized.
     * @param {number} bufferSize - the size of the analysis buffer to use for audio activity detection
     * @param {AudioContext} audioContext
     * @return {BaseSource}
     */
    createSource(id, stream, bufferSize, audioContext) {
        return new PannerNew(id, stream, bufferSize, audioContext);
    }
}
