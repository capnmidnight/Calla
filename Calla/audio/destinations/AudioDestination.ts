import { connect, disconnect, Gain } from "kudzu/audio";
import { BaseAudioElement } from "../BaseAudioElement";
import type { BaseListener } from "./spatializers/BaseListener";
import { NoSpatializationListener } from "./spatializers/NoSpatializationListener";

export type DestinationNode = AudioDestinationNode | MediaStreamAudioDestinationNode;

export class AudioDestination extends BaseAudioElement<BaseListener> {
    private _remoteUserInput: AudioNode;
    private _spatializedInput: AudioNode;
    private _nonSpatializedInput: AudioNode;
    private _trueDestination: DestinationNode;

    constructor(destination: DestinationNode) {
        super("final");
        this._remoteUserInput = Gain("remote-user-input");
        this._spatializedInput = Gain("spatialized-input");
        this._nonSpatializedInput = Gain(
            "non-spatialized-input",
            this.volumeControl);

        connect(this._nonSpatializedInput, this.volumeControl);
        this.setDestination(destination);
    }

    private disposed2 = false;
    dispose(): void {
        if (!this.disposed2) {
            this.setDestination(null);
            disconnect(this._nonSpatializedInput);
            super.dispose();
            this.disposed2 = true;
        }
    }

    get spatialized() {
        return !(this.spatializer instanceof NoSpatializationListener);
    }

    get remoteUserInput() {
        return this._remoteUserInput;
    }

    get spatializedInput() {
        return this._spatializedInput;
    }

    get nonSpatializedInput() {
        return this._nonSpatializedInput;
    }

    get trueDestination() {
        return this._trueDestination;
    }

    setDestination(v: DestinationNode) {
        if (v !== this._trueDestination) {
            if (this._trueDestination) {
                disconnect(this.volumeControl);
            }
            this._trueDestination = v;
            if (this._trueDestination) {
                connect(this.volumeControl, this._trueDestination);
            }
        }
    }

    protected disconnectSpatializer() {
        disconnect(this.spatializer);
        disconnect(this.spatializedInput);
        disconnect(this.remoteUserInput);
    }

    protected connectSpatializer() {
        connect(this.remoteUserInput, this.spatializedInput);
        connect(this.spatializedInput, this.spatializer);
        connect(this.spatializer, this.volumeControl);
    }
}
