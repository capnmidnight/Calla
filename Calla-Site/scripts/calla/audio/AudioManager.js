import { onUserGesture } from "../../html/evts";
import { EventBase } from "../events/EventBase";
import { getFile } from "../fetching";
import { ActivityAnalyser } from "./ActivityAnalyser";
import { AudioActivityEvent } from "./AudioActivityEvent";
import { AudioSource } from "./AudioSource";
import { MockAudioContext } from "./MockAudioContext";
import { AudioListenerNew } from "./spatializers/listeners/AudioListenerNew";
import { AudioListenerOld } from "./spatializers/listeners/AudioListenerOld";
import { BaseListener } from "./spatializers/listeners/BaseListener";
import { ResonanceScene } from "./spatializers/listeners/ResonanceScene";

const BUFFER_SIZE = 1024,
    audioActivityEvt = new AudioActivityEvent(),
    audioReadyEvt = new Event("audioready");

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
        this.users = new Map();

        /** @type {Map<string, ActivityAnalyser>} */
        this.analysers = new Map();

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

        if (this.audioContext instanceof AudioContext
            && !this.ready) {
            onUserGesture(() => {
                this.dispatchEvent(audioReadyEvt);
            }, () => {
                this.start();
                return this.ready;
            });
        }

        Object.seal(this);
    }

    addEventListener(name, listener, opts) {
        if (name === audioReadyEvt.type
            && this.ready) {
            listener(audioReadyEvt);
        }
        else {
            super.addEventListener(name, listener, opts);
        }
    }

    get ready() {
        return this.audioContext.state === "running";
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

            for (let clip of this.clips.values()) {
                clip.update(t);
            }

            for (let user of this.users.values()) {
                user.update(t);
            }

            for (let analyser of this.analysers.values()) {
                analyser.update(t);
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
     * @param {boolean} spatialize - whether or not the audio stream should be spatialized. Stereo audio streams that are spatialized will get down-mixed to a single channel.
     * @return {import("./spatializers/sources/BaseSource").BaseSource}
     */
    createSpatializer(id, stream, spatialize) {
        if (!this.listener) {
            throw new Error("Audio context isn't ready");
        }

        if (!stream) {
            throw new Error("No stream or audio element given.");
        }

        return this.listener.createSource(id, stream, spatialize, this.audioContext);
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
    createUser(id) {
        if (!this.users.has(id)) {
            this.users.set(id, new AudioSource());
        }

        return this.users.get(id);
    }

    /**
     * Create a new user for the audio listener.
     * @param {string} id
     * @returns {AudioSource}
     */
    createLocalUser(id) {
        const user = this.createUser(id);
        user.spatializer = this.listener;
        return user;
    }

    /**
     * Creates a new sound effect from a series of fallback paths
     * for media files.
     * @param {string} name - the name of the sound effect, to reference when executing playback.
     * @param {boolean} loop - whether or not the sound effect should be played on loop.
     * @param {boolean} autoPlay - whether or not the sound effect should be played immediately.
     * @param {boolean} spatialize - whether or not the sound effect should be spatialized.
     * @param {import("../fetching").progressCallback} - an optional callback function to use for tracking progress of loading the clip.
     * @param {...string} paths - a series of fallback paths for loading the media of the sound effect.
     */
    async createClip(name, loop, autoPlay, spatialize, onProgress, ...paths) {
        const clip = new AudioSource();

        const sources = [];
        for (let path of paths) {
            const s = document.createElement("source");
            if (onProgress) {
                path = await getFile(path, onProgress);
            }
            s.src = path;
            sources.push(s);
        }

        const elem = document.createElement("audio");
        elem.loop = loop;
        elem.controls = false;
        elem.playsInline = true;
        elem.autoplay = autoPlay;
        elem.append(...sources);

        clip.spatializer = this.createSpatializer(name, elem, spatialize);

        this.clips.set(name, clip);

        return clip;
    }

    /**
     * Plays a named sound effect.
     * @param {string} name - the name of the effect to play.
     * @param {number} [volume=1] - the volume at which to play the effect.
     */
    async playClip(name, volume = 1) {
        if (this.clips.has(name)) {
            const clip = this.clips.get(name);
            clip.volume = volume;
            await clip.spatializer.play();
        }
    }

    stopClip(name) {
        if (this.clips.has(name)) {
            const clip = this.clips.get(name);
            clip.spatializer.stop();
        }
    }

    /**
     * Get an audio source.
     * @param {Map<string, AudioSource>} sources - the collection of audio sources from which to retrieve.
     * @param {string} id - the id of the audio source to get
     **/
    getSource(sources, id) {
        return sources.get(id) || null;
    }

    /**
     * Get an existing user.
     * @param {string} id
     * @returns {AudioSource}
     */
    getUser(id) {
        return this.getSource(this.users, id);
    }

    /**
     * Get an existing audio clip.
     * @param {string} id
     * @returns {AudioSource}
     */
    getClip(id) {
        return this.getSource(this.clips, id);
    }

    /**
     * Remove an audio source from audio processing.
     * @param {Map<string, AudioSource>} sources - the collection of audio sources from which to remove.
     * @param {string} id - the id of the audio source to remove
     **/
    removeSource(sources, id) {
        if (sources.has(id)) {
            const source = sources.get(id);
            sources.delete(id);
            source.dispose();
        }
    }

    /**
     * Remove a user from audio processing.
     * @param {string} id - the id of the user to remove
     **/
    removeUser(id) {
        this.removeSource(this.users, id);
    }

    /**
     * Remove an audio clip from audio processing.
     * @param {string} id - the id of the audio clip to remove
     **/
    removeClip(id) {
        this.removeSource(this.clips, id);
    }

    /**
     * @param {string} id
     * @param {MediaStream|HTMLAudioElement} stream
     **/
    setUserStream(id, stream) {
        if (this.users.has(id)) {
            const user = this.users.get(id);
            if (this.analysers.has(id)) {
                const analyser = this.analysers.get(id);
                this.analysers.delete(id);
                analyser.removeEventListener("audioActivity", this.onAudioActivity);
                analyser.dispose();
            }

            if (stream) {
                user.spatializer = this.createSpatializer(id, stream, true);
                user.spatializer.setAudioProperties(this.minDistance, this.maxDistance, this.rolloff, this.transitionTime);

                const analyser = new ActivityAnalyser(user, this.audioContext, BUFFER_SIZE);
                analyser.addEventListener("audioActivity", this.onAudioActivity);
                this.analysers.set(id, analyser);

                if (user.spatializer.audio) {
                    user.spatializer.audio.autoPlay = true;
                    user.spatializer.audio.muted = true;
                    user.spatializer.audio.addEventListener("onloadedmetadata", () =>
                        user.spatializer.audio.play());
                    user.spatializer.audio.play();
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

        for (let user of this.users.values()) {
            if (user.spatializer) {
                user.spatializer.setAudioProperties(this.minDistance, this.maxDistance, this.rolloff, this.transitionTime);
            }
        }

        for (let clip of this.clips.values()) {
            if (clip.spatializer) {
                clip.spatializer.setAudioProperties(this.minDistance, this.maxDistance, this.rolloff, this.transitionTime);
            }
        }
    }

    /**
     * @callback withPoseCallback
     * @param {InterpolatedPose} pose
     * @param {number} dt
     */

    /**
     * Get a pose, normalize the transition time, and perform on operation on it, if it exists.
     * @param {Map<string, AudioSource>} sources - the collection of poses from which to retrieve the pose.
     * @param {string} id - the id of the pose for which to perform the operation.
     * @param {number} dt - the amount of time to take to make the transition. Defaults to this AudioManager's `transitionTime`.
     * @param {withPoseCallback} poseCallback
     */
    withPose(sources, id, dt, poseCallback) {
        if (sources.has(id)) {
            const source = sources.get(id);
            const pose = source.pose;

            if (dt === null) {
                dt = this.transitionTime;
            }

            poseCallback(pose, dt);
        }
    }

    /**
     * Get a user pose, normalize the transition time, and perform on operation on it, if it exists.
     * @param {string} id - the id of the user for which to perform the operation.
     * @param {number} dt - the amount of time to take to make the transition. Defaults to this AudioManager's `transitionTime`.
     * @param {withPoseCallback} poseCallback
     */
    withUser(id, dt, poseCallback) {
        this.withPose(this.users, id, dt, poseCallback);
    }

    /**
     * Set the position of a user.
     * @param {string} id - the id of the user for which to set the position.
     * @param {number} x - the horizontal component of the position.
     * @param {number} y - the vertical component of the position.
     * @param {number} z - the lateral component of the position.
     * @param {number?} dt - the amount of time to take to make the transition. Defaults to this AudioManager's `transitionTime`.
     **/
    setUserPosition(id, x, y, z, dt = null) {
        this.withUser(id, dt, (pose, dt) => {
            pose.setTargetPosition(x, y, z, this.currentTime, dt);
        });
    }

    /**
     * Set the orientation of a user.
     * @param {string} id - the id of the user for which to set the position.
     * @param {number} fx - the horizontal component of the forward vector.
     * @param {number} fy - the vertical component of the forward vector.
     * @param {number} fz - the lateral component of the forward vector.
     * @param {number} ux - the horizontal component of the up vector.
     * @param {number} uy - the vertical component of the up vector.
     * @param {number} uz - the lateral component of the up vector.
     * @param {number?} dt - the amount of time to take to make the transition. Defaults to this AudioManager's `transitionTime`.
     **/
    setUserOrientation(id, fx, fy, fz, ux, uy, uz, dt = null) {
        this.withUser(id, dt, (pose, dt) => {
            pose.setTargetOrientation(fx, fy, fz, ux, uy, uz, this.currentTime, dt);
        });
    }

    /**
     * Set the position and orientation of a user.
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
     * @param {number?} dt - the amount of time to take to make the transition. Defaults to this AudioManager's `transitionTime`.
     **/
    setUserPose(id, px, py, pz, fx, fy, fz, ux, uy, uz, dt = null) {
        this.withUser(id, dt, (pose, dt) => {
            pose.setTarget(px, py, pz, fx, fy, fz, ux, uy, uz, this.currentTime, dt);
        });
    }

    /**
     * Get an audio clip pose, normalize the transition time, and perform on operation on it, if it exists.
     * @param {string} id - the id of the audio clip for which to perform the operation.
     * @param {number} dt - the amount of time to take to make the transition. Defaults to this AudioManager's `transitionTime`.
     * @param {withPoseCallback} poseCallback
     */
    withClip(id, dt, poseCallback) {
        this.withPose(this.clips, id, dt, poseCallback);
    }

    /**
     * Set the position of an audio clip.
     * @param {string} id - the id of the audio clip for which to set the position.
     * @param {number} x - the horizontal component of the position.
     * @param {number} y - the vertical component of the position.
     * @param {number} z - the lateral component of the position.
     * @param {number?} dt - the amount of time to take to make the transition. Defaults to this AudioManager's `transitionTime`.
     **/
    setClipPosition(id, x, y, z, dt = null) {
        this.withClip(id, dt, (pose, dt) => {
            pose.setTargetPosition(x, y, z, this.currentTime, dt);
        });
    }

    /**
     * Set the orientation of an audio clip.
     * @param {string} id - the id of the audio clip for which to set the position.
     * @param {number} fx - the horizontal component of the forward vector.
     * @param {number} fy - the vertical component of the forward vector.
     * @param {number} fz - the lateral component of the forward vector.
     * @param {number} ux - the horizontal component of the up vector.
     * @param {number} uy - the vertical component of the up vector.
     * @param {number} uz - the lateral component of the up vector.
     * @param {number?} dt - the amount of time to take to make the transition. Defaults to this AudioManager's `transitionTime`.
     **/
    setClipOrientation(id, fx, fy, fz, ux, uy, uz, dt = null) {
        this.withClip(id, dt, (pose, dt) => {
            pose.setTargetOrientation(fx, fy, fz, ux, uy, uz, this.currentTime, dt);
        });
    }

    /**
     * Set the position and orientation of an audio clip.
     * @param {string} id - the id of the audio clip for which to set the position.
     * @param {number} px - the horizontal component of the position.
     * @param {number} py - the vertical component of the position.
     * @param {number} pz - the lateral component of the position.
     * @param {number} fx - the horizontal component of the forward vector.
     * @param {number} fy - the vertical component of the forward vector.
     * @param {number} fz - the lateral component of the forward vector.
     * @param {number} ux - the horizontal component of the up vector.
     * @param {number} uy - the vertical component of the up vector.
     * @param {number} uz - the lateral component of the up vector.
     * @param {number?} dt - the amount of time to take to make the transition. Defaults to this AudioManager's `transitionTime`.
     **/
    setClipPose(id, px, py, pz, fx, fy, fz, ux, uy, uz, dt = null) {
        this.withClip(id, dt, (pose, dt) => {
            pose.setTarget(px, py, pz, fx, fy, fz, ux, uy, uz, this.currentTime, dt);
        });
    }
}