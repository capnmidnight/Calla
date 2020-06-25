import { BaseSpatializer } from "./BaseSpatializer.js";
import { clamp, project } from "../math.js";

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
        this.wasMuted = false;
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

    update() {
        if (!!this.source) {
            const lx = this.destination.positionX,
                ly = this.destination.positionY,
                distX = this.positionX - lx,
                distY = this.positionY - ly,
                dist = Math.sqrt(distX * distX + distY * distY),
                range = clamp(project(dist, this.destination.minDistance, this.destination.maxDistance), 0, 1),
                muted = range >= 1;

            if (muted !== this.wasMuted) {
                this.wasMuted = muted;
                if (muted) {
                    this.source.disconnect(this.node);
                }
                else {
                    this.source.connect(this.node);
                }
            }
        }
    }
}