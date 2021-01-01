import { BaseNode } from "./BaseNode";
export class NoSpatializationNode extends BaseNode {
    /**
     * Creates a new "spatializer" that performs no panning. An anti-spatializer.
     */
    constructor(id, source, audioContext, destination) {
        super(id, source, audioContext);
        this.gain.connect(destination);
        Object.seal(this);
    }
    update(_loc, _t) {
        // do nothing
    }
}
//# sourceMappingURL=NoSpatializationNode.js.map