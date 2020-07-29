import { InterpolatedPose } from "../../positions/InterpolatedPose.js";
import { PannerOld } from "../sources/PannerOld.js";
import { AudioListenerBase } from "./AudioListenerBase.js";

/**
 * A positioner that uses WebAudio's playback dependent time progression.
 **/
export class AudioListenerOld extends AudioListenerBase {
    /**
     * Creates a new positioner that uses WebAudio's playback dependent time progression.
     * @param {Destination} destination - the audio node that will receive the position value.
     */
    constructor(destination) {
        super(destination);

        Object.seal(this);
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
     * @param {string} id
     * @param {MediaStream|HTMLAudioElement} stream - the audio element that is being spatialized.
     * @param {number} bufferSize - the size of the analysis buffer to use for audio activity detection
     * @return {BaseSource}
     */
    createSource(id, stream, bufferSize) {
        return new PannerOld(id, this.destination, stream, bufferSize);
    }
}

