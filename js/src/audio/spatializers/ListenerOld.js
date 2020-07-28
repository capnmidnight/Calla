import { InterpolatedPose } from "../positions/InterpolatedPose.js";
import { ListenerBase } from "./ListenerBase.js";
import { PannerOld } from "./PannerOld.js";

/**
 * A positioner that uses WebAudio's playback dependent time progression.
 **/
export class ListenerOld extends ListenerBase {
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
        this.node.setPosition(p.x, p.y, p.z);
        this.node.setOrientation(f.x, f.y, f.z, u.x, u.y, u.z);
    }


    /**
     * Creates a spatialzer for an audio source.
     * @private
     * @param {MediaStream|HTMLAudioElement} stream - the audio element that is being spatialized.
     * @param {number} bufferSize - the size of the analysis buffer to use for audio activity detection
     * @return {BaseSource}
     */
    createSource(stream, bufferSize) {
        return new PannerOld(this.destination, stream, bufferSize);
    }
}

