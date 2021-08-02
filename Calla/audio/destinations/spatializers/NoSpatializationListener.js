import { gain, Gain } from "kudzu/audio";
import { NoSpatializationNode } from "../../sources/spatializers/NoSpatializationNode";
import { BaseListener } from "./BaseListener";
export class NoSpatializationListener extends BaseListener {
    constructor() {
        super();
        this.input = this.output = Gain("listener-volume-correction", gain(0.1));
    }
    /**
     * Do nothing
     */
    update(_loc, _t) {
    }
    /**
     * Creates a spatialzer for an audio source.
     */
    createSpatializer(_spatialize, _isRemoteStream, destination) {
        return new NoSpatializationNode(destination.nonSpatializedInput);
    }
}
//# sourceMappingURL=NoSpatializationListener.js.map