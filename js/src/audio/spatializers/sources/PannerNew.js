import { InterpolatedPose } from "../../positions/InterpolatedPose.js";
import { PannerBase } from "./PannerBase.js";

/**
 * A positioner that uses WebAudio's playback dependent time progression.
 **/
export class PannerNew extends PannerBase {

    /**
     * Creates a new positioner that uses WebAudio's playback dependent time progression.
     * @param {string} id
     * @param {Destination} destination
     * @param {MediaStream|HTMLAudioElement} stream
     * @param {number} bufferSize
     */
    constructor(id, destination, stream, bufferSize) {
        super(id, destination, stream, bufferSize);

        Object.seal(this);
    }

    /**
     * Calculates the new position for the given time.
     * @protected
     * @param {InterpolatedPose} pose
     */
    update(pose) {
        super.update(pose);
        const { p, f } = pose.current;
        this.inNode.positionX.setValueAtTime(p.x, 0);
        this.inNode.positionY.setValueAtTime(p.y, 0);
        this.inNode.positionZ.setValueAtTime(p.z, 0);
        this.inNode.orientationX.setValueAtTime(f.x, 0);
        this.inNode.orientationY.setValueAtTime(f.y, 0);
        this.inNode.orientationZ.setValueAtTime(f.z, 0);
    }
}

