import { arrayRemove } from "kudzu/arrays/arrayRemove";
import { arraySortedInsert } from "kudzu/arrays/arraySortedInsert";
import { TypedEventBase } from "kudzu/events/EventBase";
import { onUserGesture } from "kudzu/events/onUserGesture";
import { waitFor } from "kudzu/events/waitFor";
import { autoPlay, controls, display, muted, playsInline, srcObject, styles } from "kudzu/html/attrs";
import { Audio } from "kudzu/html/tags";
import { using } from "kudzu/using";
import { ActivityAnalyser } from "./ActivityAnalyser";
import { AudioActivityEvent } from "./AudioActivityEvent";
import { AudioSource } from "./AudioSource";
import { canChangeAudioOutput } from "./canChangeAudioOutput";
import { ResonanceAudioListener } from "./spatializers/listeners/ResonanceAudioListener";
import { VolumeScalingListener } from "./spatializers/listeners/VolumeScalingListener";
import { WebAudioListenerNew } from "./spatializers/listeners/WebAudioListenerNew";
import { WebAudioListenerOld } from "./spatializers/listeners/WebAudioListenerOld";
if (!("AudioContext" in globalThis) && "webkitAudioContext" in globalThis) {
    globalThis.AudioContext = globalThis.webkitAudioContext;
}
if (!("OfflineAudioContext" in globalThis) && "webkitOfflineAudioContext" in globalThis) {
    globalThis.OfflineAudioContext = globalThis.webkitOfflineAudioContext;
}
const BUFFER_SIZE = 1024;
const audioActivityEvt = new AudioActivityEvent();
const audioReadyEvt = new Event("audioready");
const testAudio = Audio();
const useTrackSource = "createMediaStreamTrackSource" in AudioContext.prototype;
const useElementSource = !useTrackSource && !("createMediaStreamSource" in AudioContext.prototype);
const audioTypes = new Map([
    ["wav", ["audio/wav", "audio/vnd.wave", "audio/wave", "audio/x-wav"]],
    ["mp3", ["audio/mpeg"]],
    ["m4a", ["audio/mp4"]],
    ["m4b", ["audio/mp4"]],
    ["3gp", ["audio/mp4"]],
    ["3g2", ["audio/mp4"]],
    ["aac", ["audio/aac", "audio/aacp"]],
    ["oga", ["audio/ogg"]],
    ["ogg", ["audio/ogg"]],
    ["spx", ["audio/ogg"]],
    ["webm", ["audio/webm"]],
    ["flac", ["audio/flac"]]
]);
function shouldTry(path) {
    const idx = path.lastIndexOf(".");
    if (idx > -1) {
        const ext = path.substring(idx + 1);
        if (audioTypes.has(ext)) {
            for (const type of audioTypes.get(ext)) {
                if (testAudio.canPlayType(type)) {
                    return true;
                }
            }
            return false;
        }
    }
    return true;
}
let hasAudioContext = "AudioContext" in globalThis;
let hasAudioListener = "AudioListener" in globalThis;
let hasOldAudioListener = hasAudioListener && "setPosition" in AudioListener.prototype;
let hasNewAudioListener = hasAudioListener && "positionX" in AudioListener.prototype;
let attemptResonanceAPI = hasAudioListener;
export var SpatializerType;
(function (SpatializerType) {
    SpatializerType["Low"] = "volumescale";
    SpatializerType["Medium"] = "webaudiopanner";
    SpatializerType["High"] = "resonance";
})(SpatializerType || (SpatializerType = {}));
/**
 * A manager of audio sources, destinations, and their spatialization.
 **/
export class AudioManager extends TypedEventBase {
    /**
     * Creates a new manager of audio sources, destinations, and their spatialization.
     **/
    constructor(type, getBlob) {
        super();
        this.type = type;
        this.getBlob = getBlob;
        this.minDistance = 1;
        this.maxDistance = 10;
        this.rolloff = 1;
        this.algorithm = "logarithmic";
        this.transitionTime = 0.5;
        this._offsetRadius = 0;
        this.clips = new Map();
        this.users = new Map();
        this.analysers = new Map();
        this.sortedUserIDs = new Array();
        this.localUserID = null;
        this.listener = null;
        this.audioContext = null;
        this.element = null;
        this.destination = null;
        this._audioOutputDeviceID = null;
        this.onAudioActivity = (evt) => {
            audioActivityEvt.id = evt.id;
            audioActivityEvt.isActive = evt.isActive;
            this.dispatchEvent(audioActivityEvt);
        };
        this.createContext();
        Object.seal(this);
    }
    get offsetRadius() {
        return this._offsetRadius;
    }
    set offsetRadius(v) {
        this._offsetRadius = v;
        this.updateUserOffsets();
    }
    addEventListener(type, callback, options = null) {
        if (type === audioReadyEvt.type
            && this.ready) {
            callback(audioReadyEvt);
        }
        else {
            super.addEventListener(type, callback, options);
        }
    }
    get ready() {
        return this.audioContext && this.audioContext.state === "running";
    }
    /**
     * Perform the audio system initialization, after a user gesture
     **/
    async start() {
        await this.audioContext.resume();
        await this.setAudioOutputDeviceID(this._audioOutputDeviceID);
        if (this.element) {
            await this.element.play();
        }
    }
    update() {
        if (this.audioContext) {
            const t = this.currentTime;
            for (const clip of this.clips.values()) {
                clip.update(t);
            }
            for (const user of this.users.values()) {
                user.update(t);
            }
            for (const analyser of this.analysers.values()) {
                analyser.update();
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
            this.audioContext = new AudioContext();
            if (canChangeAudioOutput) {
                this.destination = this.audioContext.createMediaStreamDestination();
                this.element = Audio(playsInline, autoPlay, srcObject(this.destination.stream), styles(display("none")));
                document.body.appendChild(this.element);
            }
            else {
                this.destination = this.audioContext.destination;
            }
            // These checks are done in an arcane way because it makes the fallback logic
            // for each step self-contained. It's easier to look at a single step and determine
            // wether or not it is correct, without having to look at previous blocks of code.
            if (this.type === SpatializerType.High) {
                if (hasAudioContext && hasAudioListener && attemptResonanceAPI) {
                    try {
                        this.listener = new ResonanceAudioListener(this.audioContext, this.destination);
                    }
                    catch (exp) {
                        attemptResonanceAPI = false;
                        this.type = SpatializerType.Medium;
                        console.warn("Resonance Audio API not available!", exp);
                    }
                }
                else {
                    this.type = SpatializerType.Medium;
                }
            }
            if (this.type === SpatializerType.Medium) {
                if (hasAudioContext && hasAudioListener) {
                    if (hasNewAudioListener) {
                        try {
                            this.listener = new WebAudioListenerNew(this.audioContext, this.destination);
                        }
                        catch (exp) {
                            hasNewAudioListener = false;
                            console.warn("No AudioListener.positionX property!", exp);
                        }
                    }
                    if (!hasNewAudioListener && hasOldAudioListener) {
                        try {
                            this.listener = new WebAudioListenerOld(this.audioContext, this.destination);
                        }
                        catch (exp) {
                            hasOldAudioListener = false;
                            console.warn("No WebAudio API!", exp);
                        }
                    }
                    if (!hasNewAudioListener && !hasOldAudioListener) {
                        this.type = SpatializerType.Low;
                        hasAudioListener = false;
                    }
                }
                else {
                    this.type = SpatializerType.Low;
                }
            }
            if (this.type === SpatializerType.Low) {
                this.listener = new VolumeScalingListener(this.audioContext, this.destination);
            }
            if (this.listener === null) {
                throw new Error("Calla requires a functioning WebAudio system.");
            }
            if (this.ready) {
                this.start();
                this.dispatchEvent(audioReadyEvt);
            }
            else {
                onUserGesture(() => this.dispatchEvent(audioReadyEvt), async () => {
                    await this.start();
                    return this.ready;
                });
            }
        }
    }
    getAudioOutputDeviceID() {
        return this.element?.sinkId;
    }
    async setAudioOutputDeviceID(deviceID) {
        this._audioOutputDeviceID = deviceID || "";
        if (this.element
            && this._audioOutputDeviceID !== this.element.sinkId) {
            await this.element.setSinkId(this._audioOutputDeviceID);
        }
    }
    /**
     * Creates a spatialzer for an audio source.
     * @param id
     * @param source - the audio element that is being spatialized.
     * @param spatialize - whether or not the audio stream should be spatialized. Stereo audio streams that are spatialized will get down-mixed to a single channel.
     */
    createSpatializer(id, source, spatialize) {
        if (!this.listener) {
            throw new Error("Audio context isn't ready");
        }
        return this.listener.createSpatializer(id, source, spatialize, this.audioContext);
    }
    /**
     * Gets the current playback time.
     */
    get currentTime() {
        return this.audioContext.currentTime;
    }
    /**
     * Create a new user for audio processing.
     */
    createUser(id) {
        let user = this.users.get(id);
        if (!user) {
            user = new AudioSource(id);
            this.users.set(id, user);
            arraySortedInsert(this.sortedUserIDs, id);
            this.updateUserOffsets();
        }
        return user;
    }
    /**
     * Create a new user for the audio listener.
     */
    createLocalUser(id) {
        this.localUserID = id;
        let oldID = null;
        let user = null;
        for (const entry of this.users.entries()) {
            if (entry[1].spatializer === this.listener) {
                [oldID, user] = entry;
                break;
            }
        }
        if (user) {
            this.users.delete(oldID);
            arrayRemove(this.sortedUserIDs, oldID);
            this.users.set(id, user);
            arraySortedInsert(this.sortedUserIDs, id);
            this.updateUserOffsets();
        }
        else {
            user = this.createUser(id);
            user.spatializer = this.listener;
        }
        return user;
    }
    /**
     * Creates a new sound effect from a series of fallback paths
     * for media files.
     * @param name - the name of the sound effect, to reference when executing playback.
     * @param looping - whether or not the sound effect should be played on loop.
     * @param autoPlaying - whether or not the sound effect should be played immediately.
     * @param spatialize - whether or not the sound effect should be spatialized.
     * @param vol - the volume at which to set the clip.
     * @param path - a path for loading the media of the sound effect.
     * @param onProgress - an optional callback function to use for tracking progress of loading the clip.
     */
    async createClip(name, looping, autoPlaying, spatialize, vol, path, onProgress) {
        if (path == null || path.length === 0) {
            throw new Error("No clip source path provided");
        }
        let goodBlob = null;
        if (!shouldTry(path)) {
            if (onProgress) {
                onProgress(1, 1, "skip");
            }
        }
        else {
            const blob = await this.getBlob(path, onProgress);
            if (testAudio.canPlayType(blob.type)) {
                goodBlob = blob;
            }
        }
        if (!goodBlob) {
            throw new Error("Cannot play file: " + path);
        }
        const buffer = await goodBlob.arrayBuffer();
        const data = await this.audioContext.decodeAudioData(buffer);
        const source = this.audioContext.createBufferSource();
        source.buffer = data;
        source.loop = looping;
        const clip = new AudioSource("audio-clip-" + name);
        clip.spatializer = this.createSpatializer(name, source, spatialize);
        clip.spatializer.volume = vol;
        if (autoPlaying) {
            clip.spatializer.play();
        }
        this.clips.set(name, clip);
        return clip;
    }
    hasClip(name) {
        return this.clips.has(name);
    }
    /**
     * Plays a named sound effect.
     * @param name - the name of the effect to play.
     */
    async playClip(name) {
        if (this.ready && this.hasClip(name)) {
            const clip = this.clips.get(name);
            await clip.spatializer.play();
        }
    }
    stopClip(name) {
        if (this.ready && this.hasClip(name)) {
            const clip = this.clips.get(name);
            clip.spatializer.stop();
        }
    }
    /**
     * Get an audio source.
     * @param sources - the collection of audio sources from which to retrieve.
     * @param id - the id of the audio source to get
     **/
    getSource(sources, id) {
        return sources.get(id) || null;
    }
    /**
     * Get an existing user.
     */
    getUser(id) {
        return this.getSource(this.users, id);
    }
    /**
     * Get an existing audio clip.
     */
    getClip(id) {
        return this.getSource(this.clips, id);
    }
    /**
     * Remove an audio source from audio processing.
     * @param sources - the collection of audio sources from which to remove.
     * @param id - the id of the audio source to remove
     **/
    removeSource(sources, id) {
        if (sources.has(id)) {
            using(sources.get(id), (source) => {
                if (source.spatializer) {
                    source.spatializer.stop();
                }
                sources.delete(id);
            });
        }
    }
    /**
     * Remove a user from audio processing.
     **/
    removeUser(id) {
        this.removeSource(this.users, id);
        arrayRemove(this.sortedUserIDs, id);
        this.updateUserOffsets();
    }
    /**
     * Remove an audio clip from audio processing.
     **/
    removeClip(id) {
        this.removeSource(this.clips, id);
    }
    createSourceFromStream(stream) {
        if (useTrackSource) {
            const tracks = stream.getAudioTracks()
                .map((track) => this.audioContext.createMediaStreamTrackSource(track));
            if (tracks.length === 0) {
                throw new Error("No audio tracks!");
            }
            else if (tracks.length === 1) {
                return tracks[0];
            }
            else {
                const merger = this.audioContext.createChannelMerger(tracks.length);
                for (const track of tracks) {
                    track.connect(merger);
                }
                return merger;
            }
        }
        else {
            const elem = Audio(playsInline(true), autoPlay(true), muted(!useElementSource), controls(false), styles(display("none")), srcObject(stream));
            document.body.appendChild(elem);
            elem.play();
            if (useElementSource) {
                return this.audioContext.createMediaElementSource(elem);
            }
            else {
                return this.audioContext.createMediaStreamSource(stream);
            }
        }
    }
    async setUserStream(id, stream) {
        if (this.users.has(id)) {
            if (this.analysers.has(id)) {
                using(this.analysers.get(id), (analyser) => {
                    this.analysers.delete(id);
                    analyser.removeEventListener("audioActivity", this.onAudioActivity);
                });
            }
            const user = this.users.get(id);
            user.spatializer = null;
            if (stream) {
                await waitFor(() => stream.active);
                const source = this.createSourceFromStream(stream);
                user.spatializer = this.createSpatializer(id, source, true);
                user.spatializer.setAudioProperties(this.minDistance, this.maxDistance, this.rolloff, this.algorithm, this.transitionTime);
                const analyser = new ActivityAnalyser(user, this.audioContext, BUFFER_SIZE);
                analyser.addEventListener("audioActivity", this.onAudioActivity);
                this.analysers.set(id, analyser);
            }
        }
    }
    updateUserOffsets() {
        if (this.offsetRadius > 0) {
            const idx = this.sortedUserIDs.indexOf(this.localUserID);
            const dAngle = 2 * Math.PI / this.sortedUserIDs.length;
            const localAngle = (idx + 1) * dAngle;
            const dx = this.offsetRadius * Math.sin(localAngle);
            const dy = this.offsetRadius * (Math.cos(localAngle) - 1);
            for (let i = 0; i < this.sortedUserIDs.length; ++i) {
                const id = this.sortedUserIDs[i];
                const angle = (i + 1) * dAngle;
                const x = this.offsetRadius * Math.sin(angle) - dx;
                const z = this.offsetRadius * (Math.cos(angle) - 1) - dy;
                this.setUserOffset(id, x, 0, z);
            }
        }
    }
    /**
     * Sets parameters that alter spatialization.
     **/
    setAudioProperties(minDistance, maxDistance, rolloff, algorithm, transitionTime) {
        this.minDistance = minDistance;
        this.maxDistance = maxDistance;
        this.transitionTime = transitionTime;
        this.rolloff = rolloff;
        this.algorithm = algorithm;
        for (const user of this.users.values()) {
            if (user.spatializer) {
                user.spatializer.setAudioProperties(this.minDistance, this.maxDistance, this.rolloff, this.algorithm, this.transitionTime);
            }
        }
    }
    /**
     * Get a pose, normalize the transition time, and perform on operation on it, if it exists.
     * @param sources - the collection of poses from which to retrieve the pose.
     * @param id - the id of the pose for which to perform the operation.
     * @param dt - the amount of time to take to make the transition. Defaults to this AudioManager's `transitionTime`.
     * @param poseCallback
     */
    withPose(sources, id, dt, poseCallback) {
        if (sources.has(id)) {
            const source = sources.get(id);
            const pose = source.pose;
            if (dt == null) {
                dt = this.transitionTime;
            }
            return poseCallback(pose, dt);
        }
        return null;
    }
    /**
     * Get a user pose, normalize the transition time, and perform on operation on it, if it exists.
     * @param id - the id of the user for which to perform the operation.
     * @param dt - the amount of time to take to make the transition. Defaults to this AudioManager's `transitionTime`.
     * @param poseCallback
     */
    withUser(id, dt, poseCallback) {
        return this.withPose(this.users, id, dt, poseCallback);
    }
    /**
     * Set the comfort position offset for a given user.
     * @param id - the id of the user for which to set the offset.
     * @param x - the horizontal component of the offset.
     * @param y - the vertical component of the offset.
     * @param z - the lateral component of the offset.
     */
    setUserOffset(id, x, y, z) {
        this.withUser(id, null, (pose) => {
            pose.setOffset(x, y, z);
        });
    }
    /**
     * Get the comfort position offset for a given user.
     * @param id - the id of the user for which to set the offset.
     */
    getUserOffset(id) {
        return this.withUser(id, null, (pose) => {
            return pose.offset;
        });
    }
    /**
     * Set the position and orientation of a user.
     * @param id - the id of the user for which to set the position.
     * @param px - the horizontal component of the position.
     * @param py - the vertical component of the position.
     * @param pz - the lateral component of the position.
     * @param fx - the horizontal component of the forward vector.
     * @param fy - the vertical component of the forward vector.
     * @param fz - the lateral component of the forward vector.
     * @param ux - the horizontal component of the up vector.
     * @param uy - the vertical component of the up vector.
     * @param uz - the lateral component of the up vector.
     * @param dt - the amount of time to take to make the transition. Defaults to this AudioManager's `transitionTime`.
     **/
    setUserPose(id, px, py, pz, fx, fy, fz, ux, uy, uz, dt = null) {
        this.withUser(id, dt, (pose, dt) => {
            pose.setTarget(px, py, pz, fx, fy, fz, ux, uy, uz, this.currentTime, dt);
        });
    }
    /**
     * Get an audio clip pose, normalize the transition time, and perform on operation on it, if it exists.
     * @param id - the id of the audio clip for which to perform the operation.
     * @param dt - the amount of time to take to make the transition. Defaults to this AudioManager's `transitionTime`.
     * @param poseCallback
     */
    withClip(id, dt, poseCallback) {
        return this.withPose(this.clips, id, dt, poseCallback);
    }
    /**
     * Set the position of an audio clip.
     * @param id - the id of the audio clip for which to set the position.
     * @param x - the horizontal component of the position.
     * @param y - the vertical component of the position.
     * @param z - the lateral component of the position.
     * @param dt - the amount of time to take to make the transition. Defaults to this AudioManager's `transitionTime`.
     **/
    setClipPosition(id, x, y, z, dt = null) {
        this.withClip(id, dt, (pose, dt) => {
            pose.setTargetPosition(x, y, z, this.currentTime, dt);
        });
    }
    /**
     * Set the orientation of an audio clip.
     * @param id - the id of the audio clip for which to set the position.
     * @param fx - the horizontal component of the forward vector.
     * @param fy - the vertical component of the forward vector.
     * @param fz - the lateral component of the forward vector.
     * @param ux - the horizontal component of the up vector.
     * @param uy - the vertical component of the up vector.
     * @param uz - the lateral component of the up vector.
     * @param dt - the amount of time to take to make the transition. Defaults to this AudioManager's `transitionTime`.
     **/
    setClipOrientation(id, fx, fy, fz, ux, uy, uz, dt = null) {
        this.withClip(id, dt, (pose, dt) => {
            pose.setTargetOrientation(fx, fy, fz, ux, uy, uz, this.currentTime, dt);
        });
    }
    /**
     * Set the position and orientation of an audio clip.
     * @param id - the id of the audio clip for which to set the position.
     * @param px - the horizontal component of the position.
     * @param py - the vertical component of the position.
     * @param pz - the lateral component of the position.
     * @param fx - the horizontal component of the forward vector.
     * @param fy - the vertical component of the forward vector.
     * @param fz - the lateral component of the forward vector.
     * @param ux - the horizontal component of the up vector.
     * @param uy - the vertical component of the up vector.
     * @param uz - the lateral component of the up vector.
     * @param dt - the amount of time to take to make the transition. Defaults to this AudioManager's `transitionTime`.
     **/
    setClipPose(id, px, py, pz, fx, fy, fz, ux, uy, uz, dt = null) {
        this.withClip(id, dt, (pose, dt) => {
            pose.setTarget(px, py, pz, fx, fy, fz, ux, uy, uz, this.currentTime, dt);
        });
    }
}
//# sourceMappingURL=AudioManager.js.map