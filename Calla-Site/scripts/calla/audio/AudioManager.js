import { EventBase } from "../events/EventBase";
import { AudioActivityEvent } from "./AudioActivityEvent";
import { AudioSource } from "./AudioSource";
import { MockAudioContext } from "./MockAudioContext";
import { AudioListenerNew } from "./spatializers/listeners/AudioListenerNew";
import { AudioListenerOld } from "./spatializers/listeners/AudioListenerOld";
import { BaseListener } from "./spatializers/listeners/BaseListener";
import { ResonanceScene } from "./spatializers/listeners/ResonanceScene";

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
export class AudioManager extends EventBase {

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

        /** @type {Map<string, AudioSource>} */
        this.sources = new Map();

        /** @type {Map<string, AudioSource>} */
        this.clips = new Map();

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

        /** @type {BaseListener} */
        this.listener = null;

        /** @type {AudioContext} */
        this.audioContext = null;

        this.createContext();

        if (this.audioContext instanceof AudioContext) {
            const gestures = Object.keys(window)
                .filter(x => x.startsWith("on"))
                .map(x => x.substring(2));

            const startAudio = () => {
                this.start();
                if (this.audioContext.state === "running") {
                    for (let gesture of gestures) {
                        window.removeEventListener(gesture, startAudio);
                    }
                }
            }

            for (let gesture of gestures) {
                window.addEventListener(gesture, startAudio);
            }
        }

        Object.seal(this);
    }

    /** 
     * Perform the audio system initialization, after a user gesture 
     **/
    start() {
        this.createContext();
        this.audioContext.resume();
    }

    update() {
        if (this.audioContext) {
            const t = this.currentTime;
            for (let source of this.sources.values()) {
                source.update(t);
            }

            for (let clip of this.clips.values()) {
                clip.update(t);
            }
        }
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
        }
    }

    /**
     * Creates a spatialzer for an audio source.
     * @private
     * @param {string} id
     * @param {MediaStream|HTMLAudioElement} stream - the audio element that is being spatialized.
     * @param {number} bufferSize - the size of the analysis buffer to use for audio activity detection
     * @return {import("./spatializers/sources/BaseSource").BaseSource}
     */
    createSpatializer(id, stream, bufferSize) {
        if (!this.listener) {
            throw new Error("Audio context isn't ready");
        }

        if (!stream) {
            throw new Error("No stream or audio element given.");
        }

        return this.listener.createSource(id, stream, bufferSize, this.audioContext);
    }

    /**
     * Creates a new sound effect from a series of fallback paths
     * for media files.
     * @param {string} name - the name of the sound effect, to reference when executing playback.
     * @param {string[]} paths - a series of fallback paths for loading the media of the sound effect.
     */
    addClip(name, ...paths) {
        const source = new AudioSource();

        const sources = paths
            .map((p) => {
                const s = document.createElement("source");
                s.src = p;
                return s;
            });

        const elem = document.createElement("audio");
        elem.controls = false;
        elem.playsInline = true;
        elem.append(...sources);

        source.spatializer = this.createSpatializer(name, elem);

        this.clips.set(name, source);
    }

    /**
     * Plays a named sound effect.
     * @param {string} name - the name of the effect to play.
     * @param {number} [volume=1] - the volume at which to play the effect.
     */
    playClip(name, volume = 1) {
        if (this.clips.has(name)) {
            const clip = this.clips.get(name);
            clip.volume = volume;
            clip.spatializer.play();
        }
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
     * @returns {AudioSource}
     */
    createSource(id) {
        if (!this.sources.has(id)) {
            this.sources.set(id, new AudioSource());
        }

        return this.sources.get(id);
    }

    /**
     * Get an existing audio source.
     * @param {string} id
     * @returns {AudioSource}
     */
    getSource(id) {
        return this.sources.get(id) || null;
    }

    /**
     * Remove a user from audio processing.
     * @param {string} id - the id of the user to remove
     **/
    removeSource(id) {
        if (this.sources.has(id)) {
            const source = this.sources.get(id);
            this.sources.delete(id);
            source.dispose();
        }
    }

    /**
     * @param {string} id
     * @param {MediaStream|HTMLAudioElement} stream
     **/
    setSourceStream(id, stream) {
        if (this.sources.has(id)) {
            const source = this.sources.get(id);
            if (source.spatializer) {
                source.spatializer.removeEventListener("audioActivity", this.onAudioActivity);
                source.spatializer = null;
            }

            if (stream) {
                source.spatializer = this.createSpatializer(id, stream, BUFFER_SIZE);
                if (source.spatializer) {
                    if (source.spatializer.audio) {
                        source.spatializer.audio.autoPlay = true;
                        source.spatializer.audio.muted = true;
                        source.spatializer.audio.addEventListener("onloadedmetadata", () =>
                            source.spatializer.audio.play());
                        source.spatializer.audio.play();
                    }
                    source.spatializer.setAudioProperties(this.minDistance, this.maxDistance, this.rolloff, this.transitionTime);
                    source.spatializer.addEventListener("audioActivity", this.onAudioActivity);
                }
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

        for (let source of this.sources.values()) {
            if (source.spatializer) {
                source.spatializer.setAudioProperties(this.minDistance, this.maxDistance, this.rolloff, this.transitionTime);
            }
        }

        for (let clip of this.clips.values()) {
            if (clip.spatializer) {
                clip.spatializer.setAudioProperties(this.minDistance, this.maxDistance, this.rolloff, this.transitionTime);
            }
        }
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
            const pose = source.pose;
            pose.setTargetPosition(x, y, z, this.currentTime, this.transitionTime);
        }
    }

    /**
     * Set the position of an audio source.
     * @param {string} id - the id of the user for which to set the position.
     * @param {number} fx - the horizontal component of the forward vector.
     * @param {number} fy - the vertical component of the forward vector.
     * @param {number} fz - the lateral component of the forward vector.
     * @param {number} ux - the horizontal component of the up vector.
     * @param {number} uy - the vertical component of the up vector.
     * @param {number} uz - the lateral component of the up vector.
     **/
    setUserOrientation(id, fx, fy, fz, ux, uy, uz) {
        if (this.sources.has(id)) {
            const source = this.sources.get(id);
            const pose = source.pose;
            pose.setTargetOrientation(fx, fy, fz, ux, uy, uz, this.currentTime, this.transitionTime);
        }
    }

    /**
     * Set the position of an audio source.
     * @param {string} id - the id of the user for which to set the position.
     * @param {number} px - the horizontal component of the position.
     * @param {number} py - the vertical component of the position.
     * @param {number} pz - the lateral component of the position.
     * @param {number} fx - the horizontal component of the forward vector.
     * @param {number} fy - the vertical component of the forward vector.
     * @param {number} fz - the lateral component of the forward vector.
     * @param {number} ux - the horizontal component of the up vector.
     * @param {number} uy - the vertical component of the up vector.
     * @param {number} uz - the lateral component of the up vector.
     **/
    setUserPose(id, px, py, pz, fx, fy, fz, ux, uy, uz) {
        if (this.sources.has(id)) {
            const source = this.sources.get(id);
            const pose = source.pose;
            pose.setTarget(px, py, pz, fx, fy, fz, ux, uy, uz, this.currentTime, this.transitionTime);
        }
    }
}