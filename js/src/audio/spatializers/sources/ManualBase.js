import { clamp, project } from "../../../math.js";
import { Vector } from "../../positions/Vector.js";
import { BaseSpatializer } from "../BaseSpatializer.js";

export class ManualBase extends BaseSpatializer {
    /**
     * @param {Destination} destination
     */
    constructor(destination) {
        super(destination);
        this.delta = new Vector();
        this.volume = 1;
        this.pan = 0;
    }

    /**
     * Performs the spatialization operation for the audio source's latest location.
     * @param {InterpolatedPose} pose
     **/
    update(pose) {
        const start = this.destination.pose.current.p,
            end = pose.current.p;

        this.delta.sub(end, start);

        const dist = this.delta.len,
            distScale = project(dist, this.minDistance, this.maxDistance);
        this.volume = 1 - clamp(distScale, 0, 1);
        this.volume = this.volume * this.volume;
        this.pan = dist > 0
            ? this.delta.x / dist
            : 0;
    }
}
