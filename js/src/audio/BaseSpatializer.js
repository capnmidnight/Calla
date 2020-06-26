export class BaseSpatializer extends EventTarget {
    constructor(userID, destination, audio, position) {
        super();

        this.id = userID;
        this.destination = destination;
        this.audio = audio;
        this.position = position;
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
    }

    setTarget(evt) {
        this.position.setTarget(evt.x, evt.y, this.destination.audioContext.currentTime, this.destination.transitionTime);
    }
}
