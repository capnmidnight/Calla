import { gain, Gain } from "kudzu/audio";
import { Pose } from "../../positions/Pose";
import { BaseEmitter } from "../../sources/spatializers/BaseEmitter";
import { NoSpatializationNode } from "../../sources/spatializers/NoSpatializationNode";
import { AudioDestination } from "../AudioDestination";
import { BaseListener } from "./BaseListener";


export class NoSpatializationListener extends BaseListener {
    constructor() {
        super();
        this.input = this.output = Gain(
            "listener-volume-correction",
            gain(0.1));
    }

    /**
     * Do nothing
     */
    update(_loc: Pose, _t: number): void {
    }

    /**
     * Creates a spatialzer for an audio source.
     */
    createSpatializer(_spatialize: boolean, _isRemoteStream: boolean, destination: AudioDestination): BaseEmitter {
        return new NoSpatializationNode(destination.nonSpatializedInput);
    }
}
