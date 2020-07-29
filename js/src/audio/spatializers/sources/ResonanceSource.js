import "../../../../lib/resonance-audio.js";
import { InterpolatedPose } from "../../positions/InterpolatedPose.js";
import { BaseAnalyzed } from "./BaseAnalyzed.js";
import { Destination } from "../../Destination.js";

/**
 * A spatializer that uses Google's Resonance Audio library.
 **/
export class ResonanceSource extends BaseAnalyzed {

    /**
     * Creates a new spatializer that uses Google's Resonance Audio library.
     * @param {string} id
     * @param {Destination} destination
     * @param {MediaStream|HTMLAudioElement} stream
     * @param {number} bufferSize
     */
    constructor(id, destination, stream, bufferSize) {
        const resNode = destination.pose.spatializer.scene.createSource();
        super(id, destination, stream, bufferSize, resNode.input);

        this.resNode = resNode;
    }

    /**
     * Performs the spatialization operation for the audio source's latest location.
     * @param {InterpolatedPose} pose
     **/
    update(pose) {
        super.update(pose);
        const { p, f, u } = pose.current;
        this.resNode.setMinDistance(this.destination.minDistance);
        this.resNode.setMaxDistance(this.destination.maxDistance);
        this.resNode.setPosition(p.x, p.y, p.z);
        this.resNode.setOrientation(f.x, f.y, f.z, u.x, u.y, u.z);
    }

    /**
     * Discard values and make this instance useless.
     */
    dispose() {
        this.resNode = null;
        super.dispose();
    }
}