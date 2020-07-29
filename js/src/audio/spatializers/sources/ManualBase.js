import { clamp, project } from "../../../math.js";
import { Pose } from "../../positions/Pose.js";
import { Vector } from "../../positions/Vector.js";
import { BaseSpatializer } from "../BaseSpatializer.js";

export class ManualBase extends BaseSpatializer {
    /**
     * @param {Pose} dest
     */
    constructor(dest) {
        super(dest);
        this.dest = dest;
        this.delta = new Vector();
        this.volume = 1;
        this.pan = 0;

        Object.seal(this);
    }

    /**
     * Performs the spatialization operation for the audio source's latest location.
     * @param {Pose} loc
     */
    update(loc) {
        super.update(loc);

        this.delta.sub(loc.p, this.dest.p);

        const dist = this.delta.len,
            distScale = project(dist, this.minDistance, this.maxDistance);
        this.volume = 1 - clamp(distScale, 0, 1);
        this.volume = Math.round(100 * this.volume * this.volume) / 100;
        this.pan = dist > 0
            ? this.delta.x / dist
            : 0;
    }
}
