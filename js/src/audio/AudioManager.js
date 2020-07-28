import { RequestAnimationFrameTimer } from "../timers/RequestAnimationFrameTimer.js";
import { AudioActivityEvent } from "./AudioActivityEvent.js";
import { BaseAudioClient } from "./BaseAudioClient.js";
import { Destination } from "./Destination.js";
import { InterpolatedPose } from "./positions/InterpolatedPose.js";

const BUFFER_SIZE = 1024,
    audioActivityEvt = new AudioActivityEvent;

/**
 * A manager of audio sources, destinations, and their spatialization.
 **/
export class AudioManager extends BaseAudioClient {

    /**
     * Creates a new manager of audio sources, destinations, and their spatialization.
     **/
    constructor() {
        super();

        /**
         * Forwards on the audioActivity of an audio source.
         * @param {AudioActivityEvent} evt
         * @fires AudioManager#audioActivity
         */
        this.onAudioActivity = (evt) => {
            audioActivityEvt.id = evt.id;
            audioActivityEvt.isActive = evt.isActive;
            this.dispatchEvent(audioActivityEvt);
        };

        /** @type {Map.<string, InterpolatedPose>} */
        this.sources = new Map();

        this.destination = new Destination();

        this.timer = new RequestAnimationFrameTimer();
        this.timer.addEventListener("tick", () => {
            this.destination.update();
            for (let source of this.sources.values()) {
                source.update(this.destination.currentTime);
            }
        });

        Object.seal(this);
    }

    /** 
     * Perform the audio system initialization, after a user gesture 
     **/
    start() {
        this.destination.createContext();
        this.timer.start();
    }

    /**
     * @param {string} id
     * @returns {InterpolatedPose}
     */
    createUser(id) {
        if (!this.sources.has(id)) {
            this.sources.set(id, new InterpolatedPose());
        }
        return this.sources.get(id);
    }

    /**
     * Remove a user from audio processing.
     * @param {string} id - the id of the user to remove
     **/
    removeUser(id) {
        if (this.sources.has(id)) {
            const pose = this.sources.get(id);
            pose.dispose();
            this.sources.delete(id);
        }
    }

    /**
     * @param {string} userID
     * @param {MediaStream|HTMLAudioElement} stream
     **/
    setSource(userID, stream) {
        if (this.sources.has(userID)) {
            const pose = this.sources.get(userID);
            if (pose.spatializer) {
                pose.spatializer.removeEventListener("audioActivity", this.onAudioActivity);
            }

            pose.spatializer = this.destination.createSpatializer(stream, BUFFER_SIZE);

            if (pose.spatializer) {
                pose.spatializer.addEventListener("audioActivity", this.onAudioActivity);
            }
        }
    }

    /**
     * Sets parameters that alter spatialization.
     * @param {number} minDistance
     * @param {number} maxDistance
     * @param {number} rolloff
     * @param {number} transitionTime
     **/
    setAudioProperties(minDistance, maxDistance, rolloff, transitionTime) {
        this.destination.setAudioProperties(minDistance, maxDistance, rolloff, transitionTime);
    }

    /**
     * Set the position of the listener.
     * @param {number} x - the horizontal component of the position.
     * @param {number} y - the vertical component of the position.
     * @param {number} z - the lateral component of the position.
     */
    setLocalPosition(x, y, z) {
        this.destination.pose.setTarget(x, y, z, 0, 0, 1, 0, 1, 0, this.destination.currentTime, this.destination.transitionTime);
    }

    /**
     * @returns {BaseAudioElement}
     **/
    getLocalPose() {
        return this.destination.pose.end;
    }

    /**
     * Set the position of an audio source.
     * @param {string} id - the id of the user for which to set the position.
     * @param {number} x - the horizontal component of the position.
     * @param {number} y - the vertical component of the position.
     * @param {number} z - the lateral component of the position.
     **/
    setUserPosition(id, x, y, z) {
        if (this.sources.has(id)) {
            const pose = this.sources.get(id);
            pose.setTarget(x, y, z, 0, 0, 1, 0, 1, 0, this.destination.currentTime, this.destination.transitionTime);
        }
    }
}