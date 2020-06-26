import { BaseSpatializer } from "./BaseSpatializer.js";
import { InterpolatedPosition } from "./InterpolatedPosition.js";
import { clamp, project } from "../math.js";

export class VolumeOnlySpatializer extends BaseSpatializer {
    constructor(userID, destination, audio) {
        super(userID, destination, audio, new InterpolatedPosition());
        this.audio.play();
    }

    update() {
        super.update();

        const lx = this.destination.position.x,
            ly = this.destination.position.y,
            distX = this.position.x - lx,
            distY = this.position.y - ly,
            dist = Math.sqrt(distX * distX + distY * distY),
            range = clamp(project(dist, this.destination.minDistance, this.destination.maxDistance), 0, 1);

        this.audio.volume = 1 - range;
    }
}
