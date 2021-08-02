import type { Pose } from "../../positions/Pose";
import { BaseEmitter } from "./BaseEmitter";


export class NoSpatializationNode extends BaseEmitter {
    /**
     * Creates a new "spatializer" that performs no panning. An anti-spatializer.
     */
    constructor(destination: AudioNode) {
        super(destination);
        this.input = this.output = destination;
        Object.seal(this);
    }

    protected createNew(): NoSpatializationNode {
        return new NoSpatializationNode(this.destination);
    }

    update(_loc: Pose, _t: number): void {
        // do nothing
    }
}
