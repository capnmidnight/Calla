import { Gain } from "kudzu/audio";
import { Pose } from "../../positions/Pose";
import { VolumeScalingNode } from "../../sources/spatializers/VolumeScalingNode";
import { BaseListener } from "./BaseListener";
/**
 * A positioner that uses WebAudio's gain nodes to only adjust volume.
 **/
export class VolumeScalingListener extends BaseListener {
    pose;
    /**
     * Creates a new positioner that uses WebAudio's playback dependent time progression.
     */
    constructor() {
        super();
        this.input = this.output = Gain("volume-scaler");
        this.pose = new Pose();
    }
    /**
     * Performs the spatialization operation for the audio source's latest location.
     */
    update(loc, _t) {
        this.pose.copy(loc);
    }
    /**
     * Creates a spatialzer for an audio source.
     */
    createSpatializer(spatialize, isRemoteStream, destination) {
        if (spatialize) {
            const dest = isRemoteStream
                ? destination.remoteUserInput
                : destination.spatializedInput;
            return new VolumeScalingNode(dest, this);
        }
        else {
            return super.createSpatializer(spatialize, isRemoteStream, destination);
        }
    }
}
//# sourceMappingURL=VolumeScalingListener.js.map