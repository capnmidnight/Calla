import { Pose } from "../../positions/Pose.js";
import { PannerBase } from "./PannerBase.js";

/**
 * A positioner that uses the WebAudio API's old setPosition method.
 **/
export class PannerOld extends PannerBase {

    /**
     * Creates a new positioner that uses the WebAudio API's old setPosition method.
     * @param {string} id
     * @param {MediaStream|HTMLAudioElement} stream
     * @param {number} bufferSize
     * @param {AudioContext} audioContext
     */
    constructor(id, stream, bufferSize, audioContext) {
        super(id, stream, bufferSize, audioContext);

        Object.seal(this);
    }

    /**
     * Performs the spatialization operation for the audio source's latest location.
     * @param {Pose} loc
     */
    update(loc) {
        super.update(loc);
        const { p, f } = loc;
        this.inNode.setPosition(p.x, p.y, p.z);
        this.inNode.setOrientation(f.x, f.y, f.z);
    }
}
