import { BaseAudioElement } from "../BaseAudioElement";
import { connect, disconnect } from "../GraphVisualizer";
import { NoSpatializationNode } from "./spatializers/NoSpatializationNode";
export class BaseAudioSource extends BaseAudioElement {
    constructor(id, audioContext) {
        super(audioContext);
        this.id = id;
    }
    dispose() {
        this.source = null;
        super.dispose();
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
                disconnect(this._source, this.volumeControl);
            }
            this._source = v;
            if (this._source) {
                connect(this._source, this.volumeControl);
            }
        }
    }
    disconnectSpatializer() {
        disconnect(this.volumeControl, this.spatializer.input);
    }
    connectSpatializer() {
        connect(this.volumeControl, this.spatializer.input);
    }
}
//# sourceMappingURL=BaseAudioSource.js.map