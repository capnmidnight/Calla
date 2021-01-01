import { VolumeScalingNode } from "../nodes/VolumeScalingNode";
import { BaseListener } from "./BaseListener";
/**
 * A positioner that uses WebAudio's gain nodes to only adjust volume.
 **/
export class VolumeScalingListener extends BaseListener {
    /**
     * Creates a new positioner that uses WebAudio's playback dependent time progression.
     */
    constructor(audioContext, destination) {
        super(audioContext, destination);
        this.pose = null;
        this.gain.gain.value = 0.25;
        Object.seal(this);
    }
    /**
     * Performs the spatialization operation for the audio source's latest location.
     */
    update(loc, _t) {
        this.pose = loc;
    }
    /**
     * Creates a spatialzer for an audio source.
     */
    createSpatializer(id, source, spatialize, audioContext) {
        if (spatialize) {
            return new VolumeScalingNode(id, source, audioContext, this.gain, this);
        }
        else {
            return super.createSpatializer(id, source, spatialize, audioContext);
        }
    }
}
//# sourceMappingURL=VolumeScalingListener.js.map