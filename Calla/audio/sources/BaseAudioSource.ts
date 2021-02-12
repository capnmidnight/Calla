import { BaseAudioElement } from "../BaseAudioElement";
import { connect, disconnect } from "../GraphVisualizer";
import { BaseEmitter } from "./spatializers/BaseEmitter";
import { NoSpatializationNode } from "./spatializers/NoSpatializationNode";

export abstract class BaseAudioSource<T extends AudioNode> extends BaseAudioElement<BaseEmitter> {

    private _source: T;

    constructor(public id: string, audioContext: BaseAudioContext) {
        super(audioContext);
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

    set source(v: T) {
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

    protected disconnectSpatializer() {
        disconnect(this.volumeControl, this.spatializer.input);
    }

    protected connectSpatializer() {
        connect(this.volumeControl, this.spatializer.input);
    }
}