import type { Pose } from "../../positions/Pose";
import { BaseEmitter } from "./BaseEmitter";


export class NoSpatializationNode extends BaseEmitter {
    /**
     * Creates a new "spatializer" that performs no panning. An anti-spatializer.
     */
    constructor(audioContext: BaseAudioContext, destination: AudioNode) {
        super(audioContext, destination);
        this.input = this.output = destination;
        Object.seal(this);
    }

    protected createNew(): NoSpatializationNode {
        return new NoSpatializationNode(this.audioContext, this.destination);
    }

    update(_loc: Pose, _t: number): void {
        // do nothing
    }
}
