import { BaseSpatializer } from "./BaseSpatializer.js";
import { InterpolatedPosition } from "./InterpolatedPosition.js";

export class VolumeOnlySpatializer extends BaseSpatializer {

    constructor(userID, destination, audio) {
        super(userID, destination, audio, new InterpolatedPosition());
        this.audio.play();

        Object.seal(this);
    }

    update() {
        super.update();
        this.audio.volume = this.volume;
    }
}
