import { BaseSpatializer } from "./BaseSpatializer.js";

export class FullSpatializer extends BaseSpatializer {

    constructor(destination, audio, analyser) {
        super(destination, audio, analyser, destination.audioContext.createPanner());

        this.node.panningModel = "HRTF";
        this.node.distanceModel = "inverse";
        this.node.refDistance = destination.minDistance;
        this.node.rolloffFactor = destination.rolloff;
        this.node.coneInnerAngle = 360;
        this.node.coneOuterAngle = 0;
        this.node.coneOuterGain = 0;
        this.node.positionY.setValueAtTime(0, this.destination.audioContext.currentTime);

        this._muted = false;
    }

    setAudioProperties(evt) {
        this.node.refDistance = evt.minDistance;
        this.node.rolloffFactor = evt.rolloff;
    }

    setPosition(evt) {
        const time = this.destination.audioContext.currentTime + this.destination.transitionTime;
        // our 2D position is in X/Y coords, but our 3D position
        // along the horizontal plane is X/Z coords.
        this.node.positionX.linearRampToValueAtTime(evt.x, time);
        this.node.positionZ.linearRampToValueAtTime(evt.y, time);
    }

    get positionX() {
        return this.node.positionX.value;
    }

    get positionY() {
        return this.node.positionZ.value;
    }

    get muted() {
        return this._muted;
    }

    set muted(value) {
        if (!!this.source && value !== this.muted) {
            this._muted = value;
            if (this.muted) {
                this.source.disconnect(this.node);
            }
            else {
                this.source.connect(this.node);
            }
        }
    }
}