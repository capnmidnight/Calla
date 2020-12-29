import { vec3 } from "gl-matrix";
import { clamp, project } from "kudzu";
import { BaseNode } from "./BaseNode";
const delta = vec3.create();
export class VolumeScalingNode extends BaseNode {
    /**
     * Creates a new spatializer that performs no panning, only distance-based volume scaling
     */
    constructor(id, source, audioContext, destination, listener) {
        super(id, source, audioContext);
        this.listener = listener;
        this.gain.connect(destination);
        Object.seal(this);
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