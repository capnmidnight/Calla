import type { Pose } from "../../positions/Pose";
import type { VolumeScalingListener } from "../listeners/VolumeScalingListener";
import { BaseNode } from "./BaseNode";
export declare class VolumeScalingNode extends BaseNode {
    private listener;
    /**
     * Creates a new spatializer that performs no panning, only distance-based volume scaling
     */
    constructor(id: string, source: AudioNode, audioContext: AudioContext, destination: AudioNode, listener: VolumeScalingListener);
    update(loc: Pose, t: number): void;
}
