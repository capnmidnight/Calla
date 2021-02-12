import { BaseAudioElement } from "../BaseAudioElement";
import { connect, disconnect } from "../GraphVisualizer";
import type { BaseListener } from "./spatializers/BaseListener";
import { NoSpatializationListener } from "./spatializers/NoSpatializationListener";

export type DestinationNode = AudioDestinationNode | MediaStreamAudioDestinationNode;

export class AudioDestination extends BaseAudioElement<BaseListener> {
    private _spatializedInput: AudioNode;
    private _nonSpatializedInput: AudioNode;
    private _trueDestination: DestinationNode;

    constructor(audioContext: BaseAudioContext, destination: DestinationNode) {
        super(audioContext);
        this._spatializedInput = audioContext.createGain();
        this._nonSpatializedInput = audioContext.createGain();

        connect(this._nonSpatializedInput, this.volumeControl);
        this.setDestination(destination);
    }

    dispose() {
        this.setDestination(null);
        disconnect(this._nonSpatializedInput, this.volumeControl);
        super.dispose();
    }

    get spatialized() {
        return !(this.spatializer instanceof NoSpatializationListener);
    }

    get spatializedInput() {
        return this._spatializedInput;
    }

    get nonSpatializedInput() {
        return this._nonSpatializedInput;
    }

    setDestination(v: DestinationNode) {
        if (v !== this._trueDestination) {
            if (this._trueDestination) {
                disconnect(this.volumeControl, this._trueDestination);
            }
            this._trueDestination = v;
            if (this._trueDestination) {
                connect(this.volumeControl, this._trueDestination);
            }
        }
    }

    protected disconnectSpatializer() {
        disconnect(this.spatializer.output, this.volumeControl);
        disconnect(this._spatializedInput, this.spatializer.input);
    }

    protected connectSpatializer() {
        connect(this._spatializedInput, this.spatializer.input);
        connect(this.spatializer.output, this.volumeControl);
    }
}
