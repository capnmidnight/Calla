import { BaseEmitter } from "./BaseEmitter";
export class NoSpatializationNode extends BaseEmitter {
    /**
     * Creates a new "spatializer" that performs no panning. An anti-spatializer.
     */
    constructor(audioContext, destination) {
        super(audioContext, destination);
        this.input = this.output = destination;
        Object.seal(this);
    }
    createNew() {
        return new NoSpatializationNode(this.audioContext, this.destination);
    }
    update(_loc, _t) {
        // do nothing
    }
}
//# sourceMappingURL=NoSpatializationNode.js.map