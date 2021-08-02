import type { Pose } from "../../positions/Pose";
import { BaseEmitter } from "./BaseEmitter";
export declare class NoSpatializationNode extends BaseEmitter {
    /**
     * Creates a new "spatializer" that performs no panning. An anti-spatializer.
     */
    constructor(destination: AudioNode);
    protected createNew(): NoSpatializationNode;
    update(_loc: Pose, _t: number): void;
}
