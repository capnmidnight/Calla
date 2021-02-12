import { vec3 } from "gl-matrix";
import { clamp } from "kudzu/math/clamp";
import { project } from "kudzu/math/project";
import { BaseEmitter } from "./BaseEmitter";
const delta = vec3.create();
export class VolumeScalingNode extends BaseEmitter {
    /**
     * Creates a new spatializer that performs no panning, only distance-based volume scaling
     */
    constructor(audioContext, destination, listener) {
        const gain = audioContext.createGain();
        super(audioContext, gain, gain, destination);
        this.gain = gain;
        this.listener = listener;
        Object.seal(this);
    }
    createNew() {
        return new VolumeScalingNode(this.audioContext, this.destination, this.listener);
    }
    update(loc, t) {
        const p = this.listener.pose.p;
        vec3.sub(delta, p, loc.p);
        const distance = vec3.length(delta);
        let range = clamp(project(distance, this.minDistance, this.maxDistance), 0, 1);
        if (this.algorithm === "logarithmic") {
            range = Math.sqrt(range);
        }
        const volume = 1 - range;
        this.gain.gain.setValueAtTime(volume, t);
    }
}
//# sourceMappingURL=VolumeScalingNode.js.map