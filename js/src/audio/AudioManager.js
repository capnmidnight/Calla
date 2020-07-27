import { arrayClear } from "../protos/Array.js";
import { RequestAnimationFrameTimer } from "../timers/RequestAnimationFrameTimer.js";
import { AudioActivityEvent } from "./AudioActivityEvent.js";
import { BaseAudioClient } from "./BaseAudioClient.js";
import { Destination } from "./Destination.js";
import { BaseSpatializer } from "./spatializers/BaseSpatializer.js";

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

        /** @type {Map.<string, BaseSpatializer>} */
        this.sources = new Map();

        this.destination = new Destination();

        /** @type {Event[]} */
        const recreationQ = [];

        this.destination.addEventListener("contextDestroying", () => {
            for (let source of this.sources.values()) {
                source.removeEventListener("audioActivity", this.onAudioActivity);
                recreationQ.push({
                    id: source.id,
                    x: source.x,
                    y: source.y,
                    z: source.z,
                    audio: source.audio
                });

                source.dispose();
            }

            this.sources.clear();
        });

        this.destination.addEventListener("contextDestroyed", () => {
            this.timer.stop();
            this.destination.createContext();

            for (let recreate of recreationQ) {
                const source = this.createSource(recreate.id, recreate.audio);
                source.setPosition(recreate.x, recreate.y, recreate.z);
            }

            arrayClear(recreationQ);
            this.timer.start();
        });

        this.timer = new RequestAnimationFrameTimer();
        this.timer.addEventListener("tick", () => {
            this.destination.update();
            for (let source of this.sources.values()) {
                source.update();
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
     * @param {string} userID
     * @param {MediaStream|HTMLAudioElement} stream
     * @return {BaseSpatializer}
     **/
    createSource(userID, stream) {
        const source = this.destination.createSpatializer(userID, stream, BUFFER_SIZE);
        source.addEventListener("audioActivity", this.onAudioActivity);
        if (this.sources.has(userID)) {
            const oldSource = this.sources.get(userID);
            source.copy(oldSource);
            oldSource.dispose();
        }
        else {
            source.setPosition(0, 0, 0);
        }

        this.sources.set(userID, source);
        return source;
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
        for (let source of this.sources.values()) {
            source.setAudioProperties(minDistance, maxDistance, rolloff, transitionTime);
        }
    }

    /**
     * Set the audio device used to play audio to the local user.
     * @param {string} deviceID
     **/
    setAudioOutputDevice(deviceID) {
        for (let source of this.sources.values()) {
            source.setAudioOutputDevice(deviceID);
        }
    }

    /**
     * Remove a user from audio processing.
     * @param {string} id - the id of the user to remove
     **/
    removeSource(id) {
        if (this.sources.has(id)) {
            const source = this.sources.get(id);
            source.dispose();
            this.sources.delete(id);
        }
    }

    /**
     * Set the position of the listener.
     * @param {number} x - the horizontal component of the position.
     * @param {number} y - the vertical component of the position.
     * @param {number} z - the lateral component of the position.
     */
    setLocalPosition(x, y, z) {
        this.destination.setPosition(x, y, z);
    }

    /**
     * @returns {BaseAudioElement}
     **/
    getLocalPosition() {
        return this.destination;
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
            const source = this.sources.get(id);
            source.setPosition(x, y, z);
        }
    }
}