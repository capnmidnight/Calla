import { canChangeAudioOutput } from "../../canChangeAudioOutput";
import { BaseSpatializer } from "../BaseSpatializer";

/** Base class providing functionality for spatializers. */
export class BaseSource extends BaseSpatializer {

    /**
     * Creates a spatializer that keeps track of the relative position
     * of an audio element to the listener destination.
     * @param {string} id
     * @param {MediaStream|HTMLAudioElement} stream
     */
    constructor(id, stream) {
        super();

        this.id = id;

        /** @type {HTMLAudioElement} */
        this.audio = null;

        /** @type {MediaStream} */
        this.stream = null;

        this.volume = 1;

        if (stream instanceof HTMLAudioElement) {
            this.audio = stream;
        }
        else if (stream instanceof MediaStream) {
            this.stream = stream;
            this.audio = document.createElement("audio");
            this.audio.srcObject = this.stream;
        }
        else if (stream !== null) {
            throw new Error("Can't create a node from the given stream. Expected type HTMLAudioElement or MediaStream.");
        }

        this.audio.playsInline = true;
    }

    play() {
        if (this.audio) {
            this.audio.play();
        }
    }

    stop() {
        if (this.audio) {
            this.audio.pause();
        }
    }

    /**
     * Discard values and make this instance useless.
     */
    dispose() {
        if (this.audio) {
            this.audio.pause();
            this.audio = null;
        }
        this.stream = null;
        super.dispose();
    }

    /**
     * Changes the device to which audio will be output
     * @param {string} deviceID
     */
    setAudioOutputDevice(deviceID) {
        if (this.audio && canChangeAudioOutput) {
            this.audio.setSinkId(deviceID);
        }
    }
}

