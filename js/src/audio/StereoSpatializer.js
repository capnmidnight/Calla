import { BaseWebAudioSpatializer } from "./BaseWebAudioSpatializer.js";
import { clamp, project } from "../math.js";
import { InterpolatedPosition } from "./InterpolatedPosition.js";

export class StereoSpatializer extends BaseWebAudioSpatializer {

    constructor(destination, audio, bufferSize) {
        super(destination, audio, bufferSize,
            destination.audioContext.createStereoPanner(),
            destination.audioContext.createGain());

        this.position = new InterpolatedPosition();
        Object.seal(this);
    }

    setAudioProperties(evt) {
    }

    update() {
        super.update();

        if (!!this.source) {
            const lx = this.destination.position.x,
                ly = this.destination.position.y,
                distX = this.position.x - lx,
                distY = this.position.y - ly,
                dist = Math.sqrt(distX * distX + distY * distY),
                range = clamp(project(dist, this.destination.minDistance, this.destination.maxDistance), 0, 1);

            this.inNode.pan.value = dist > 0
                ? distX / dist
                : 0;

            this.outNode.gain.value = 1 - range;
        }
    }
}