import type { Pose } from "../../positions/Pose";
import { BaseNode } from "./BaseNode";
export declare class NoSpatializationNode extends BaseNode {
    /**
     * Creates a new "spatializer" that performs no panning. An anti-spatializer.
     */
    constructor(id: string, source: AudioNode, audioContext: AudioContext, destination: AudioNode);
    update(_loc: Pose, _t: number): void;
}
