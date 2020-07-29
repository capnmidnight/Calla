import { muted, srcObject } from "../../../html/attrs.js";
import { Audio } from "../../../html/tags.js";
import { canChangeAudioOutput } from "../../canChangeAudioOutput.js";
import { Destination } from "../../Destination.js";
import { BaseSpatializer } from "../BaseSpatializer.js";

/** Base class providing functionality for spatializers. */
export class BaseSource extends BaseSpatializer {

    /**
     * Creates a spatializer that keeps track of the relative position
     * of an audio element to the listener destination.
     * @param {string} id
     * @param {Destination} destination
     * @param {MediaStream|HTMLAudioElement} stream
     */
    constructor(id, destination, stream) {
        super(destination);

        this.id = id;

        /** @type {HTMLAudioElement} */
        this.audio = null;

        /** @type {MediaStream} */
        this.stream = null;

        if (stream instanceof HTMLAudioElement) {
            this.audio = stream;
        }
        else if (stream instanceof MediaStream) {
            this.stream = stream;
            this.audio = Audio(
                srcObject(this.stream),
                muted);
        }
        else if (stream !== null) {
            throw new Error("Can't create a node from the given stream. Expected type HTMLAudioElement or MediaStream.");
        }

        if (this.audio) {
            this.audio.autoPlay = true;
            this.audio.playsInline = true;
            this.audio.addEventListener("onloadedmetadata", () =>
                this.audio.play());
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

