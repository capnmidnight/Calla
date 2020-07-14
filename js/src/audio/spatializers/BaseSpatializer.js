import { clamp, project } from "../../math.js";
import { Destination } from "../Destination.js";
import { BasePosition } from "../positions/BasePosition.js";
import { BaseAudioElement } from "../BaseAudioElement.js";
import { canChangeAudioOutput } from "../canChangeAudioOutput.js";

/** Base class providing functionality for spatializers. */
export class BaseSpatializer extends BaseAudioElement {

    /**
     * Creates a spatializer that keeps track of the relative position
     * of an audio element to the listener destination.
     * @param {string} userID
     * @param {Destination} destination
     * @param {HTMLAudioElement} audio
     * @param {BasePosition} position
     */
    constructor(userID, destination, audio, position) {
        super(position);

        this.id = userID;
        this.destination = destination;
        this.audio = audio;
        this.volume = 1;
        this.pan = 0;
    }

    /**
     * Discard values and make this instance useless.
     */
    dispose() {
        this.audio.pause();

        this.position = null;
        this.audio = null;
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
            distX = this.position.x - lx,
            distY = this.position.y - ly,
            dist = Math.sqrt(distX * distX + distY * distY),
            distScale = project(dist, this.minDistance, this.maxDistance);

        this.volume = 1 - clamp(distScale, 0, 1);
        this.pan = dist > 0
            ? distX / dist
            : 0;
    }
}
