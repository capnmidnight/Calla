import { connect, disconnect, Gain } from "kudzu/audio";
import { BaseAudioElement } from "../BaseAudioElement";
import { NoSpatializationListener } from "./spatializers/NoSpatializationListener";
export class AudioDestination extends BaseAudioElement {
    _remoteUserInput;
    _spatializedInput;
    _nonSpatializedInput;
    _trueDestination;
    constructor(destination) {
        super("final");
        this._remoteUserInput = Gain("remote-user-input");
        this._spatializedInput = Gain("spatialized-input");
        this._nonSpatializedInput = Gain("non-spatialized-input", this.volumeControl);
        connect(this._nonSpatializedInput, this.volumeControl);
        this.setDestination(destination);
    }
    disposed2 = false;
    dispose() {
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
    setDestination(v) {
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
    disconnectSpatializer() {
        disconnect(this.spatializer);
        disconnect(this.spatializedInput);
        disconnect(this.remoteUserInput);
    }
    connectSpatializer() {
        connect(this.remoteUserInput, this.spatializedInput);
        connect(this.spatializedInput, this.spatializer);
        connect(this.spatializer, this.volumeControl);
    }
}
//# sourceMappingURL=AudioDestination.js.map