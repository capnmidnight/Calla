import { canChangeAudioOutput } from "../../canChangeAudioOutput";
import { BaseSpatializer } from "../BaseSpatializer";

/** Base class providing functionality for spatializers. */
export class BaseSource extends BaseSpatializer {
    /**
     * Creates a spatializer that keeps track of the relative position
     * of an audio element to the listener destination.
     * @param {string} id
     * @param {MediaStream|HTMLAudioElement} stream
     * @param {AudioContext} audioContext - the output WebAudio context
     * @param {AudioNode} destination - this node out to which to pipe the stream
     */
    constructor(id, stream, audioContext, destination) {
        super();

        this.id = id;

        /** @type {HTMLAudioElement} */
        this.audio = null;

        /** @type {MediaStream} */
        this.stream = null;

        /** @type {AudioNode} */
        this.source = null;

        this.volume = 1;

        if (stream instanceof HTMLAudioElement) {
            this.audio = stream;
            this.source = audioContext.createMediaElementSource(this.audio);
            this.source.connect(destination);
        }
        else if (stream instanceof MediaStream) {
            this.stream = stream;
            this.audio = document.createElement("audio");
            this.audio.srcObject = this.stream;

            const checkSource = () => {
                if (this.stream.active) {
                    this.source = audioContext.createMediaStreamSource(this.stream);
                    this.source.connect(destination);
                }
                else {
                    setTimeout(checkSource, 0);
                }
            }

            setTimeout(checkSource, 0);
        }
        else if (stream !== null) {
            throw new Error("Can't create a node from the given stream. Expected type HTMLAudioElement or MediaStream.");
        }

        this.audio.playsInline = true;
    }

    async play() {
        if (this.audio) {
            await this.audio.play();
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
        if (this.source) {
            this.source.disconnect();
            this.source = null;
        }

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

