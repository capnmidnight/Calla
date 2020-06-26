import { clamp, project } from "../math.js";

export class BaseSpatializer extends EventTarget {
    constructor(userID, destination, audio, position) {
        super();

        this.id = userID;
        this.destination = destination;
        this.audio = audio;
        this.position = position;
        this.volume = 1;
        this.pan = 0;
    }

    dispose() {
        this.audio.pause();

        this.position = null;
        this.audio = null;
        this.destination = null;
        this.id = null;
    }

    update() {
        this.position.update(this.destination.audioContext.currentTime);

        const lx = this.destination.position.x,
            ly = this.destination.position.y,
            distX = this.position.x - lx,
            distY = this.position.y - ly,
            dist = Math.sqrt(distX * distX + distY * distY);

        this.volume = 1 - clamp(project(dist, this.destination.minDistance, this.destination.maxDistance), 0, 1);
        this.pan = dist > 0
            ? distX / dist
            : 0;
    }

    setTarget(evt) {
        this.position.setTarget(evt, this.destination.audioContext.currentTime, this.destination.transitionTime);
    }
}
