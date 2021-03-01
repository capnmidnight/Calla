import { Pose } from "../../positions/Pose";
import { BaseEmitter } from "../../sources/spatializers/BaseEmitter";
import { VolumeScalingNode } from "../../sources/spatializers/VolumeScalingNode";
import { AudioDestination } from "../AudioDestination";
import { BaseListener } from "./BaseListener";

/**
 * A positioner that uses WebAudio's gain nodes to only adjust volume.
 **/
export class VolumeScalingListener extends BaseListener {
    pose: Pose;

    /**
     * Creates a new positioner that uses WebAudio's playback dependent time progression.
     */
    constructor(audioContext: BaseAudioContext) {
        super(audioContext);
        const gain = audioContext.createGain();
        this.input = this.output = gain;

        this.pose = new Pose();
    }

    /**
     * Performs the spatialization operation for the audio source's latest location.
     */
    update(loc: Pose, _t: number): void {
        this.pose.copy(loc);
    }

    /**
     * Creates a spatialzer for an audio source.
     */
    createSpatializer(spatialize: boolean, audioContext: BaseAudioContext, destination: AudioDestination): BaseEmitter {
        if (spatialize) {
            return new VolumeScalingNode(audioContext, destination.spatializedInput, this);
        }
        else {
            return super.createSpatializer(spatialize, audioContext, destination);
        }
    }
}
