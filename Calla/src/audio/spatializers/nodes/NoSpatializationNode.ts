import type { Pose } from "../../positions/Pose";
import { BaseNode } from "./BaseNode";


export class NoSpatializationNode extends BaseNode {
    /**
     * Creates a new "spatializer" that performs no panning. An anti-spatializer.
     */
    constructor(id: string, source: AudioNode, audioContext: AudioContext, destination: AudioNode) {
        super(id, source, audioContext);
        this.gain.connect(destination);
        Object.seal(this);
    }

    update(_loc: Pose, _t: number): void {
        // do nothing
    }
}
