export class BaseSpatializer {

    constructor(destination, audio, analyser, drain) {
        this.destination = destination;
        this.audio = audio;
        this.analyser = analyser;
        this.node = drain;
        this.node.connect(this.destination.audioContext.destination);
        this.source = null;
    }

    checkStream() {
        if (!this.source) {
            try {
                const stream = !!this.audio.mozCaptureStream
                    ? this.audio.mozCaptureStream()
                    : this.audio.captureStream();

                this.source = this.destination.audioContext.createMediaStreamSource(stream);
                this.source.connect(this.analyser);
                this.source.connect(this.node);
            }
            catch (exp) {
                console.warn("Source isn't available yet. Will retry in a moment. Reason: ", exp);
                return false;
            }
        }

        return true;
    }

    dispose() {
        if (!!this.source) {
            this.source.disconnect(this.analyser);
            this.source.disconnect(this.node);
            this.source = null;
        }

        this.node.disconnect(this.destination.audioContext.destination);
        this.node = null;
        this.audio = null;
        this.destination = null;
    }

    update() {
    }

    setAudioProperties(evt) {
        throw new Error("Not implemented in base class.");
    }

    setPosition(evt) {
        throw new Error("Not implemented in base class.");
    }

    get positionX() {
        throw new Error("Not implemented in base class.");
    }

    get positionY() {
        throw new Error("Not implemented in base class.");
    }
}