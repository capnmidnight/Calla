import { InterpolatedPose } from "../../positions/InterpolatedPose.js";
import { PannerBase } from "./PannerBase.js";

/**
 * A positioner that uses the WebAudio API's old setPosition method.
 **/
export class PannerOld extends PannerBase {

    /**
     * Creates a new positioner that uses the WebAudio API's old setPosition method.
     * @param {string} id
     * @param {Destination} destination
     * @param {MediaStream|HTMLAudioElement} stream
     * @param {number} bufferSize
     */
    constructor(id, destination, stream, bufferSize) {
        super(id, destination, stream, bufferSize);
    }

    /**
     * Calculates the new position for the given time.
     * @protected
     * @param {InterpolatedPose} pose
     */
    update(pose) {
        super.update(pose);
        const { p, f } = pose.current;
        this.inNode.setPosition(p.x, p.y, p.z);
        this.inNode.setOrientation(f.x, f.y, f.z);
    }
}
