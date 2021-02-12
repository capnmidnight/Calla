import type { VolumeScalingListener } from "../../destinations/spatializers/VolumeScalingListener";
import type { Pose } from "../../positions/Pose";
import { BaseEmitter } from "./BaseEmitter";
export declare class VolumeScalingNode extends BaseEmitter {
    private gain;
    private listener;
    /**
     * Creates a new spatializer that performs no panning, only distance-based volume scaling
     */
    constructor(audioContext: BaseAudioContext, destination: AudioNode, listener: VolumeScalingListener);
    protected createNew(): VolumeScalingNode;
    update(loc: Pose, t: number): void;
}
