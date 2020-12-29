import { vec3 } from "gl-matrix";
import { clamp, project } from "kudzu";
import type { Pose } from "../../positions/Pose";
import type { VolumeScalingListener } from "../listeners/VolumeScalingListener";
import { BaseNode } from "./BaseNode";

const delta = vec3.create();

export class VolumeScalingNode extends BaseNode {
    /**
     * Creates a new spatializer that performs no panning, only distance-based volume scaling
     */
    constructor(id: string, source: AudioNode, audioContext: AudioContext, destination: AudioNode, private listener: VolumeScalingListener) {
        super(id, source, audioContext);
        this.gain.connect(destination);
        Object.seal(this);
    }

    update(loc: Pose, t: number): void {
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
