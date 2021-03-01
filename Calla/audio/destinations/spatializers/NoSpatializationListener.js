import { NoSpatializationNode } from "../../sources/spatializers/NoSpatializationNode";
import { BaseListener } from "./BaseListener";
export class NoSpatializationListener extends BaseListener {
    constructor(audioContext) {
        super(audioContext);
        const gain = audioContext.createGain();
        gain.gain.value = 0.1;
        this.input = this.output = gain;
    }
    /**
     * Do nothing
     */
    update(_loc, _t) {
    }
    /**
     * Creates a spatialzer for an audio source.
     */
    createSpatializer(_spatialize, audioContext, destination) {
        return new NoSpatializationNode(audioContext, destination.nonSpatializedInput);
    }
}
//# sourceMappingURL=NoSpatializationListener.js.map