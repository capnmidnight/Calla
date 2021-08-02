import { BaseEmitter } from "./BaseEmitter";
export class NoSpatializationNode extends BaseEmitter {
    /**
     * Creates a new "spatializer" that performs no panning. An anti-spatializer.
     */
    constructor(destination) {
        super(destination);
        this.input = this.output = destination;
        Object.seal(this);
    }
    createNew() {
        return new NoSpatializationNode(this.destination);
    }
    update(_loc, _t) {
        // do nothing
    }
}
//# sourceMappingURL=NoSpatializationNode.js.map