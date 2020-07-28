import { Destination } from "../Destination.js";
import { InterpolatedPose } from "../positions/InterpolatedPose.js";
import { ListenerBase } from "./ListenerBase.js";
import { PannerNew } from "./PannerNew.js";

/**
 * A positioner that uses WebAudio's playback dependent time progression.
 **/
export class ListenerNew extends ListenerBase {
    /**
     * Creates a new positioner that uses WebAudio's playback dependent time progression.
     * @param {Destination} destination - the audio node that will receive the position value.
     */
    constructor(destination) {
        super(destination);
    }

    /**
     * @param {InterpolatedPose} pose
     */
    update(pose) {
        super.update(pose);
        const { p, f, u } = pose.current;
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
     * @return {BaseSource}
     */
    createSource(id, stream, bufferSize) {
        return new PannerNew(id, this.destination, stream, bufferSize);
    }
}
