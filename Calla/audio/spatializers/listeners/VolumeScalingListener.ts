import type { Pose } from "../../positions/Pose";
import type { BaseNode } from "../nodes/BaseNode";
import { VolumeScalingNode } from "../nodes/VolumeScalingNode";
import { BaseListener } from "./BaseListener";

/**
 * A positioner that uses WebAudio's gain nodes to only adjust volume.
 **/
export class VolumeScalingListener extends BaseListener {

    pose: Pose = null;

    /**
     * Creates a new positioner that uses WebAudio's playback dependent time progression.
     */
    constructor(audioContext: AudioContext, destination: AudioDestinationNode | MediaStreamAudioDestinationNode) {
        super(audioContext, destination);
        this.gain.gain.value = 0.25;
        Object.seal(this);
    }

    /**
     * Performs the spatialization operation for the audio source's latest location.
     */
    update(loc: Pose, _t: number): void {
        this.pose = loc;
    }

    /**
     * Creates a spatialzer for an audio source.
     */
    createSpatializer(id: string, source: AudioNode, spatialize: boolean, audioContext: AudioContext): BaseNode {
        if (spatialize) {
            return new VolumeScalingNode(id, source, audioContext, this.gain, this);
        }
        else {
            return super.createSpatializer(id, source, spatialize, audioContext);
        }
    }
}
