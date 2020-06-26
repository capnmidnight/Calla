export class BaseSpatializer extends EventTarget {
    constructor(destination, audio) {
        super();

        this.destination = destination;
        this.audio = audio;
    }

    dispose() {
        this.destination = null;
        this.audio = null;
    }

    update() {
    }

    setAudioProperties(evt) {
        throw new Error("Not implemented in base class.");
    }

    setTarget(evt) {
        throw new Error("Not implemented in base class.");
    }

    get positionX() {
        throw new Error("Not implemented in base class.");
    }

    get positionY() {
        throw new Error("Not implemented in base class.");
    }
}
