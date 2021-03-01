import { Pose } from "../../positions/Pose";
import { BaseEmitter } from "../../sources/spatializers/BaseEmitter";
import { NoSpatializationNode } from "../../sources/spatializers/NoSpatializationNode";
import { AudioDestination } from "../AudioDestination";
import { BaseListener } from "./BaseListener";


export class NoSpatializationListener extends BaseListener {
    constructor(audioContext: BaseAudioContext) {
        super(audioContext);
        const gain = audioContext.createGain();
        gain.gain.value = 0.1;
        this.input = this.output = gain;
    }

    /**
     * Do nothing
     */
    update(_loc: Pose, _t: number): void {
    }

    /**
     * Creates a spatialzer for an audio source.
     */
    createSpatializer(_spatialize: boolean, audioContext: BaseAudioContext, destination: AudioDestination): BaseEmitter {
        return new NoSpatializationNode(audioContext, destination.nonSpatializedInput);
    }
}
