import { connect, disconnect } from "kudzu/audio";
import { BaseAudioElement } from "../BaseAudioElement";
import { NoSpatializationNode } from "./spatializers/NoSpatializationNode";
export class BaseAudioSource extends BaseAudioElement {
    _source;
    constructor(id) {
        super(id);
    }
    disposed2 = false;
    dispose() {
        if (!this.disposed2) {
            this.source = null;
            super.dispose();
            this.disposed2 = true;
        }
    }
    get spatialized() {
        return !(this.spatializer instanceof NoSpatializationNode);
    }
    get source() {
        return this._source;
    }
    set source(v) {
        if (v !== this.source) {
            if (this._source) {
                disconnect(this._source);
            }
            this._source = v;
            if (this._source) {
                connect(this._source, this.volumeControl);
            }
        }
    }
    disconnectSpatializer() {
        disconnect(this.volumeControl);
    }
    connectSpatializer() {
        connect(this.volumeControl, this.spatializer);
    }
}
//# sourceMappingURL=BaseAudioSource.js.map