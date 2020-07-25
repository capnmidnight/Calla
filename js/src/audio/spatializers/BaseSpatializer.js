import { muted, srcObject } from "../../html/attrs.js";
import { Audio } from "../../html/tags.js";
import { clamp, project } from "../../math.js";
import { BaseAudioElement } from "../BaseAudioElement.js";
import { canChangeAudioOutput } from "../canChangeAudioOutput.js";
import { Destination } from "../Destination.js";
import { BasePosition } from "../positions/BasePosition.js";

/** Base class providing functionality for spatializers. */
export class BaseSpatializer extends BaseAudioElement {

    /**
     * Creates a spatializer that keeps track of the relative position
     * of an audio element to the listener destination.
     * @param {string} userID
     * @param {Destination} destination
     * @param {MediaStream|HTMLAudioElement} stream
     * @param {BasePosition} position
     */
    constructor(userID, destination, stream, position) {
        super(position);

        this.id = userID;
        this.destination = destination;
        this.volume = 1;
        this.pan = 0;

        if (stream instanceof HTMLAudioElement) {
            this.audio = stream;
        }
        else if (stream instanceof MediaStream) {
            this.stream = stream;
            this.audio = Audio(
                srcObject(this.stream),
                muted);
        }
        else {
            throw new Error("Can't create a node from the given stream. Expected type HTMLAudioElement or MediaStream.");
        }

        this.audio.autoPlay = true;
        this.audio.playsInline = true;
        this.audio.addEventListener("onloadedmetadata", () =>
            this.audio.play());
    }

    /**
     * Discard values and make this instance useless.
     */
    dispose() {
        this.audio.pause();
        this.audio = null;
        this.stream = null;
        this.position = null;
        this.destination = null;
        this.id = null;
    }

    /**
     * Changes the device to which audio will be output
     * @param {string} deviceID
     */
    setAudioOutputDevice(deviceID) {
        if (canChangeAudioOutput) {
            this.audio.setSinkId(deviceID);
        }
    }

    /**
     * Retrieves the current time from the audio context.
     * @type {number}
     */
    get currentTime() {
        return this.destination.currentTime;
    }


    /**
     * Performs the spatialization operation for the audio source's latest location.
     **/
    update() {
        super.update();

        const lx = this.destination.position.x,
            ly = this.destination.position.y,
            lz = this.destination.position.z,
            distX = this.position.x - lx,
            distY = this.position.y - ly,
            distZ = this.position.z - lz,
            distSqr = distX * distX + distY * distY + distZ * distZ,
            dist = Math.sqrt(distSqr),
            distScale = project(dist, this.minDistance, this.maxDistance);

        this.volume = 1 - clamp(distScale, 0, 1);
        this.volume = this.volume * this.volume;
        this.pan = dist > 0
            ? distX / dist
            : 0;
    }
}
