import { PannerBase } from "./PannerBase";

/**
 * A positioner that uses the WebAudio API's old setPosition method.
 **/
export class PannerOld extends PannerBase {

    /**
     * Creates a new positioner that uses the WebAudio API's old setPosition method.
     * @param {string} id
     * @param {MediaStream|HTMLAudioElement} stream
     * @param {AudioContext} audioContext
     */
    constructor(id, stream, audioContext) {
        super(id, stream, audioContext);

        Object.seal(this);
    }

    /**
     * Performs the spatialization operation for the audio source's latest location.
     * @param {import("../../positions/Pose").Pose} loc
     */
    update(loc) {
        super.update(loc);
        const { p, f } = loc;
        this.inNode.setPosition(p.x, p.y, p.z);
        this.inNode.setOrientation(f.x, f.y, f.z);
    }
}
