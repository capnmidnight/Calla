import { InterpolatedPose } from "../positions/InterpolatedPose.js";
import { PannerBase } from "./PannerBase.js";

/**
 * A positioner that uses the WebAudio API's old setPosition method.
 **/
export class PannerOld extends PannerBase {

    /**
     * Creates a new positioner that uses the WebAudio API's old setPosition method.
     * @param {Destination} destination
     * @param {MediaStream|HTMLAudioElement} stream
     * @param {number} bufferSize
     */
    constructor(destination, stream, bufferSize) {
        super(destination, stream, bufferSize);
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
