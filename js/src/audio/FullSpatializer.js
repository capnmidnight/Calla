import { BaseWebAudioSpatializer } from "./BaseWebAudioSpatializer.js";
import { clamp, project } from "../math.js";
import { WebAudioNodePosition } from "./WebAudioNodePosition.js";

export class FullSpatializer extends BaseWebAudioSpatializer {

    constructor(destination, audio, bufferSize) {
        super(destination, audio, bufferSize, destination.audioContext.createPanner());

        this.position = new WebAudioNodePosition(this.inNode);

        this.inNode.panningModel = "HRTF";
        this.inNode.distanceModel = "inverse";
        this.inNode.refDistance = destination.minDistance;
        this.inNode.rolloffFactor = destination.rolloff;
        this.inNode.coneInnerAngle = 360;
        this.inNode.coneOuterAngle = 0;
        this.inNode.coneOuterGain = 0;
        this.wasMuted = false;

        Object.seal(this);
    }

    setAudioProperties(evt) {
        this.inNode.refDistance = evt.minDistance;
        this.inNode.rolloffFactor = evt.rolloff;
    }

    update() {
        super.update();

        if (!!this.source) {
            const lx = this.destination.position.x,
                ly = this.destination.position.y,
                distX = this.position.x - lx,
                distY = this.position.y - ly,
                dist = Math.sqrt(distX * distX + distY * distY),
                range = clamp(project(dist, this.destination.minDistance, this.destination.maxDistance), 0, 1),
                muted = range >= 1;

            if (muted !== this.wasMuted) {
                this.wasMuted = muted;
                if (muted) {
                    this.source.disconnect(this.inNode);
                }
                else {
                    this.source.connect(this.inNode);
                }
            }
        }
    }
}