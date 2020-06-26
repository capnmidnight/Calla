import { BaseWebAudioSpatializer } from "./BaseWebAudioSpatializer.js";
import { clamp, project } from "../math.js";
import { WebAudioNodePosition } from "./WebAudioNodePosition.js";

export class FullSpatializer extends BaseWebAudioSpatializer {

    constructor(destination, audio, bufferSize) {
        super(destination, audio, bufferSize, destination.audioContext.createPanner());

        this.position = new WebAudioNodePosition(this.node);

        this.node.panningModel = "HRTF";
        this.node.distanceModel = "inverse";
        this.node.refDistance = destination.minDistance;
        this.node.rolloffFactor = destination.rolloff;
        this.node.coneInnerAngle = 360;
        this.node.coneOuterAngle = 0;
        this.node.coneOuterGain = 0;
        this.wasMuted = false;

        Object.seal(this);
    }

    setAudioProperties(evt) {
        this.node.refDistance = evt.minDistance;
        this.node.rolloffFactor = evt.rolloff;
    }

    setTarget(evt) {
        this.position.setTarget(evt.x, evt.y, this.destination.audioContext.currentTime, this.destination.transitionTime);
    }

    get positionX() {
        return this.position.x;
    }

    get positionY() {
        return this.position.y;
    }

    update() {
        super.update();

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