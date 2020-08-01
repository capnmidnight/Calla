import { RequestAnimationFrameTimer } from "../timers/RequestAnimationFrameTimer.js";
import { AudioActivityEvent } from "./AudioActivityEvent.js";
import { MockAudioContext } from "./MockAudioContext.js";
import { InterpolatedPose } from "./positions/InterpolatedPose.js";
import { Pose } from "./positions/Pose.js";
import { AudioListenerNew } from "./spatializers/listeners/AudioListenerNew.js";
import { AudioListenerOld } from "./spatializers/listeners/AudioListenerOld.js";
import { BaseListener } from "./spatializers/listeners/BaseListener.js";
import { ResonanceScene } from "./spatializers/listeners/ResonanceScene.js";
import { BaseSource } from "./spatializers/sources/BaseSource.js";

const BUFFER_SIZE = 1024,
    audioActivityEvt = new AudioActivityEvent();

let hasAudioContext = Object.prototype.hasOwnProperty.call(window, "AudioContext"),
    hasAudioListener = hasAudioContext && Object.prototype.hasOwnProperty.call(window, "AudioListener"),
    hasOldAudioListener = hasAudioListener && Object.prototype.hasOwnProperty.call(AudioListener.prototype, "setPosition"),
    hasNewAudioListener = hasAudioListener && Object.prototype.hasOwnProperty.call(AudioListener.prototype, "positionX"),
    attemptResonanceAPI = hasAudioListener;

/**
 * A manager of audio sources, destinations, and their spatialization.
 **/
export class AudioManager extends EventTarget {

    /**
     * Creates a new manager of audio sources, destinations, and their spatialization.
     **/
    constructor() {
        super();

        this.minDistance = 1;
        this.minDistanceSq = 1;
        this.maxDistance = 10;
        this.maxDistanceSq = 100;
        this.rolloff = 1;
        this.transitionTime = 0.5;

        /** @type {AudioContext} */
        this.audioContext = null;

        /** @type {InterpolatedPose} */
        this.pose = new InterpolatedPose();

        /** @type {BaseListener} */
        this.listener = null;

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
        this.poses = new Map();

        this.timer = new RequestAnimationFrameTimer();
        this.timer.addEventListener("tick", () => {
            this.pose.update(this.currentTime);
            for (let pose of this.poses.values()) {
                pose.update(this.currentTime);
            }
        });

        Object.seal(this);
    }

    /** 
     * Perform the audio system initialization, after a user gesture 
     **/
    start() {
        this.createContext();
        this.timer.start();
    }

    /**
     * If no audio context is currently available, creates one, and initializes the
     * spatialization of its listener.
     * 
     * If WebAudio isn't available, a mock audio context is created that provides
     * ersatz playback timing.
     **/
    createContext() {
        if (!this.audioContext) {
            if (hasAudioContext) {
                try {
                    this.audioContext = new AudioContext();
                }
                catch (exp) {
                    hasAudioContext = false;
                    console.warn("Could not create WebAudio AudioContext", exp);
                }
            }

            if (!hasAudioContext) {
                this.audioContext = new MockAudioContext();
            }

            if (hasAudioContext && attemptResonanceAPI) {
                try {
                    this.listener = new ResonanceScene(this.audioContext);
                }
                catch (exp) {
                    attemptResonanceAPI = false;
                    console.warn("Resonance Audio API not available!", exp);
                }
            }

            if (hasAudioContext && !attemptResonanceAPI && hasNewAudioListener) {
                try {
                    this.listener = new AudioListenerNew(this.audioContext.listener);
                }
                catch (exp) {
                    hasNewAudioListener = false;
                    console.warn("No AudioListener.positionX property!", exp);
                }
            }

            if (hasAudioContext && !attemptResonanceAPI && !hasNewAudioListener && hasOldAudioListener) {
                try {
                    this.listener = new AudioListenerOld(this.audioContext.listener);
                }
                catch (exp) {
                    hasOldAudioListener = false;
                    console.warn("No WebAudio API!", exp);
                }
            }

            if (!hasOldAudioListener || !hasAudioContext) {
                this.listener = new BaseListener();
            }

            this.pose.spatializer = this.listener;
        }
    }

    /**
     * Creates a spatialzer for an audio source.
     * @private
     * @param {string} id
     * @param {MediaStream|HTMLAudioElement} stream - the audio element that is being spatialized.
     * @param {number} bufferSize - the size of the analysis buffer to use for audio activity detection
     * @return {BaseSource}
     */
    createSpatializer(id, stream, bufferSize) {
        if (!stream || !this.listener) {
            return null;
        }

        return this.listener.createSource(id, stream, bufferSize, this.audioContext, this.pose.current);
    }

    /**
     * Gets the current playback time.
     * @type {number}
     */
    get currentTime() {
        return this.audioContext.currentTime;
    }

    /**
     * Create a new user for audio processing.
     * @param {string} id
     * @returns {InterpolatedPose}
     */
    createUser(id) {
        if (!this.poses.has(id)) {
            this.poses.set(id, new InterpolatedPose());
        }
        return this.poses.get(id);
    }

    /**
     * Remove a user from audio processing.
     * @param {string} id - the id of the user to remove
     **/
    removeUser(id) {
        if (this.poses.has(id)) {
            const pose = this.poses.get(id);
            pose.dispose();
            this.poses.delete(id);
        }
    }

    /**
     * @param {string} id
     * @param {MediaStream|HTMLAudioElement} stream
     **/
    setSource(id, stream) {
        if (this.poses.has(id)) {
            const pose = this.poses.get(id);
            if (pose.spatializer) {
                pose.spatializer.removeEventListener("audioActivity", this.onAudioActivity);
            }

            pose.spatializer = this.createSpatializer(id, stream, BUFFER_SIZE);

            if (pose.spatializer) {
                pose.spatializer.setAudioProperties(this.minDistance, this.maxDistance, this.rolloff, this.transitionTime);
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
        this.minDistance = minDistance;
        this.maxDistance = maxDistance;
        this.transitionTime = transitionTime;
        this.rolloff = rolloff;

        for (let pose of this.poses.values()) {
            if (pose.spatializer) {
                pose.spatializer.setAudioProperties(this.minDistance, this.maxDistance, this.rolloff, this.transitionTime);
            }
        }
    }

    /**
     * Set the position of the listener.
     * @param {number} x - the horizontal component of the position.
     * @param {number} y - the vertical component of the position.
     * @param {number} z - the lateral component of the position.
     */
    setLocalPosition(x, y, z) {
        this.pose.setTarget(x, y, z, 0, 0, 1, 0, 1, 0, this.currentTime, this.transitionTime);
    }


    /**
     * @returns {Pose}
     **/
    getLocalPose() {
        return this.pose.end;
    }

    /**
     * Set the position of an audio source.
     * @param {string} id - the id of the user for which to set the position.
     * @param {number} x - the horizontal component of the position.
     * @param {number} y - the vertical component of the position.
     * @param {number} z - the lateral component of the position.
     **/
    setUserPosition(id, x, y, z) {
        if (this.poses.has(id)) {
            const pose = this.poses.get(id);
            pose.setTarget(x, y, z, 0, 0, 1, 0, 1, 0, this.currentTime, this.transitionTime);
        }
    }
}