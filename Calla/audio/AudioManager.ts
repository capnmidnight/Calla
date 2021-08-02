import type { vec3 } from "gl-matrix";
import { arrayRemove } from "kudzu/arrays/arrayRemove";
import { arraySortedInsert } from "kudzu/arrays/arraySortedInsert";
import { audioCtx, audioReady, buffer, BufferSource, ChannelMerger, connect, decodeAudioData, hasAudioListener, hasNewAudioListener, hasOldAudioListener, loop as loopAudio, MediaElementSource, MediaStreamDestination, MediaStreamSource, MediaStreamTrackSource } from "kudzu/audio";
import { TypedEvent, TypedEventBase } from "kudzu/events/EventBase";
import { once } from "kudzu/events/once";
import { autoPlay, controls, loop, muted, playsInline, src } from "kudzu/html/attrs";
import { display, styles } from "kudzu/html/css";
import type { HTMLAudioElementWithSinkID, TagChild } from "kudzu/html/tags";
import { Audio } from "kudzu/html/tags";
import { Fetcher } from "kudzu/io/Fetcher";
import type { IFetcher } from "kudzu/io/IFetcher";
import { guessMediaTypeByFileName } from "kudzu/mediaTypes";
import type { progressCallback } from "kudzu/tasks/progressCallback";
import { assertNever } from "kudzu/typeChecks";
import type { IDisposable } from "kudzu/using";
import { canChangeAudioOutput, DeviceManager } from "../devices/DeviceManager";
import { DEFAULT_LOCAL_USER_ID } from "../tele/BaseTeleconferenceClient";
import { AudioActivityEvent } from "./AudioActivityEvent";
import { AudioDestination } from "./destinations/AudioDestination";
import type { BaseListener } from "./destinations/spatializers/BaseListener";
import { NoSpatializationListener } from "./destinations/spatializers/NoSpatializationListener";
import { ResonanceAudioListener } from "./destinations/spatializers/ResonanceAudioListener";
import { VolumeScalingListener } from "./destinations/spatializers/VolumeScalingListener";
import { WebAudioListenerNew } from "./destinations/spatializers/WebAudioListenerNew";
import { WebAudioListenerOld } from "./destinations/spatializers/WebAudioListenerOld";
import type { IPoseable } from "./IPoseable";
import type { InterpolatedPose } from "./positions/InterpolatedPose";
import { AudioBufferSpawningSource } from "./sources/AudioBufferSpawningSource";
import { AudioElementSource } from "./sources/AudioElementSource";
import type { AudioStreamSourceNode } from "./sources/AudioStreamSource";
import { AudioStreamSource } from "./sources/AudioStreamSource";
import type { IPlayableSource } from "./sources/IPlayableSource";
import { BaseEmitter } from "./sources/spatializers/BaseEmitter";

function BackgroundAudio(autoplay: boolean, mute: boolean, ...rest: TagChild[]): HTMLAudioElementWithSinkID {
    return Audio(
        playsInline(true),
        controls(false),
        muted(mute),
        autoPlay(autoplay),
        styles(display("none")),
        ...rest);
}

if (!("AudioContext" in globalThis) && "webkitAudioContext" in globalThis) {
    globalThis.AudioContext = (globalThis as any).webkitAudioContext;
}

if (!("OfflineAudioContext" in globalThis) && "webkitOfflineAudioContext" in globalThis) {
    globalThis.OfflineAudioContext = (globalThis as any).webkitOfflineAudioContext;
}


type withPoseCallback<T> = (pose: InterpolatedPose) => T;

const audioReadyEvt = new TypedEvent("audioReady");
const testAudio = Audio();

const useTrackSource = "createMediaStreamTrackSource" in AudioContext.prototype;
const useElementSourceForUsers = !useTrackSource && !("createMediaStreamSource" in AudioContext.prototype);
const useElementSourceForClips = true;

function shouldTry(path: string): boolean {
    const idx = path.lastIndexOf(".");
    if (idx > -1) {
        const types = guessMediaTypeByFileName(path);
        for (const type of types) {
            if (testAudio.canPlayType(type.value)) {
                return true;
            }
        }

        return false;
    }

    return true;
}

let tryNewAudioListener = hasNewAudioListener;
let tryOldAudioListener = hasOldAudioListener;
let tryAudioListener = hasAudioListener;
let tryResonanceAPI = hasAudioListener;

interface AudioManagerEvents {
    audioReady: TypedEvent<"audioReady">,
    audioActivity: AudioActivityEvent;
}

export enum SpatializerType {
    None = "none",
    Low = "low",
    Medium = "medium",
    High = "high"
}

function isMediaStreamAudioDestinationNode(destination: AudioDestinationNode | MediaStreamAudioDestinationNode): destination is MediaStreamAudioDestinationNode {
    return canChangeAudioOutput && "stream" in destination;
}

/**
 * A manager of audio sources, destinations, and their spatialization.
 **/
export class AudioManager extends TypedEventBase<AudioManagerEvents> {
    private minDistance = 1;
    private maxDistance = 10;
    private rolloff = 1;
    private _algorithm = "logarithmic";
    transitionTime = 0.5;
    private _offsetRadius = 0;

    private clips = new Map<string, IPlayableSource>();
    private users = new Map<string, AudioStreamSource>();

    public localUserID: string = null;
    private sortedUserIDs = new Array<string>();

    localOutput: AudioDestination = null;

    listener: BaseListener = null;
    //audioContext: AudioContext = null;
    private destination: AudioDestinationNode | MediaStreamAudioDestinationNode = null;

    private fetcher: IFetcher;
    private _type: SpatializerType;

    devices = new DeviceManager();

    private _ready: Promise<void>;
    get ready() {
        return this._ready;
    }

    /**
     * Creates a new manager of audio sources, destinations, and their spatialization.
     **/
    constructor(fetcher?: IFetcher, type?: SpatializerType) {
        super();

        this.fetcher = fetcher || new Fetcher();

        this.setLocalUserID(DEFAULT_LOCAL_USER_ID);

        //this.audioContext = new AudioContext();

        if (canChangeAudioOutput) {
            this.destination = MediaStreamDestination("final-destination",);
        }
        else {
            this.destination = audioCtx.destination;
        }

        this.localOutput = new AudioDestination(this.destination);

        this._ready = audioReady
            .then(async () => {
                if (isMediaStreamAudioDestinationNode(this.destination)) {
                    await this.devices.setDestination(this.destination);
                }
            });

        this.type = type || SpatializerType.Medium;

        Object.seal(this);
    }

    get offsetRadius() {
        return this._offsetRadius;
    }

    set offsetRadius(v) {
        this._offsetRadius = v;
        this.updateUserOffsets();
    }

    get algorithm() {
        return this._algorithm;
    }

    protected checkAddEventListener<T extends Event>(type: string, callback: (evt: T) => any) {
        if (type === audioReadyEvt.type && this.isReady) {
            callback(audioReadyEvt as any as T);
            return false;
        }
        return true;
    }

    get isReady(): boolean {
        return audioCtx.state !== "suspended";
    }

    get isRunning(): boolean {
        return audioCtx.state === "running";
    }

    update(): void {
        const t = this.currentTime;

        this.localOutput.update(t);

        for (const clip of this.clips.values()) {
            clip.update(t);
        }

        for (const user of this.users.values()) {
            user.update(t);
        }
    }


    get type() {
        return this._type;
    }

    set type(type: SpatializerType) {
        const inputType = type;

        if (type !== SpatializerType.High
            && type !== SpatializerType.Medium
            && type !== SpatializerType.Low
            && type !== SpatializerType.None) {
            assertNever(type, "Invalid spatialization type: ");
        }

        // These checks are done in an arcane way because it makes the fallback logic
        // for each step self-contained. It's easier to look at a single step and determine
        // wether or not it is correct, without having to look at previous blocks of code.
        if (type === SpatializerType.High) {
            if (tryResonanceAPI) {
                try {
                    this.listener = new ResonanceAudioListener();
                }
                catch (exp) {
                    tryResonanceAPI = false;
                    type = SpatializerType.Medium;
                    console.warn("Resonance Audio API not available!", exp);
                }
            }
            else {
                type = SpatializerType.Medium;
            }
        }
        else {
            tryResonanceAPI = false;
        }

        if (type === SpatializerType.Medium) {
            if (!tryResonanceAPI && tryAudioListener) {
                if (tryNewAudioListener) {
                    try {
                        this.listener = new WebAudioListenerNew();
                    }
                    catch (exp) {
                        tryNewAudioListener = false;
                        console.warn("No AudioListener.positionX property!", exp);
                    }
                }

                if (!tryNewAudioListener && tryOldAudioListener) {
                    try {
                        this.listener = new WebAudioListenerOld();
                    }
                    catch (exp) {
                        tryOldAudioListener = false;
                        console.warn("No WebAudio API!", exp);
                    }
                }

                if (!tryNewAudioListener && !tryOldAudioListener) {
                    type = SpatializerType.Low;
                    tryAudioListener = false;
                }
            }
            else {
                type = SpatializerType.Low;
            }
        }

        if (type === SpatializerType.Low) {
            this.listener = new VolumeScalingListener();
        }
        else if (type === SpatializerType.None) {
            this.listener = new NoSpatializationListener();
        }

        if (!this.listener) {
            throw new Error("Calla requires a functioning WebAudio system. Could not create one for type: " + inputType);
        }
        else if (type !== inputType) {
            console.warn(`Wasn't able to create the listener type ${inputType}. Fell back to ${type} instead.`);
        }

        this._type = type;

        this.localOutput.spatializer = this.listener;
        for (const clip of this.clips.values()) {
            clip.spatializer = this.createSpatializer(clip.spatialized, false);
        }

        for (const user of this.users.values()) {
            user.spatializer = this.createSpatializer(user.spatialized, false);
        }
    }

    /**
     * Creates a spatialzer for an audio source.
     * @param spatialize - whether or not the audio stream should be spatialized. Stereo audio streams that are spatialized will get down-mixed to a single channel.
     * @param isRemoteStream - whether or not the audio stream is coming from a remote user.
     */
    createSpatializer(spatialize: boolean, isRemoteStream: boolean): BaseEmitter {
        return this.listener.createSpatializer(spatialize, isRemoteStream, this.localOutput);
    }

    /**
     * Gets the current playback time.
     */
    get currentTime(): number {
        return audioCtx.currentTime;
    }

    /**
     * Create a new user for audio processing.
     */
    createUser(id: string): AudioStreamSource {
        let user: AudioStreamSource = this.users.get(id);
        if (!user) {
            user = new AudioStreamSource(id);
            this.users.set(id, user);
            arraySortedInsert(this.sortedUserIDs, id);
            this.updateUserOffsets();
        }

        return user;
    }

    /**
     * Create a new user for the audio listener.
     */
    setLocalUserID(id: string): AudioDestination {
        if (this.localOutput) {
            arrayRemove(this.sortedUserIDs, this.localUserID);
            this.localUserID = id;
            arraySortedInsert(this.sortedUserIDs, this.localUserID);
            this.updateUserOffsets();
        }
        else {
        }

        return this.localOutput;
    }

    /**
     * Creates a new sound effect from a series of fallback paths
     * for media files.
     * @param id - the name of the sound effect, to reference when executing playback.
     * @param looping - whether or not the sound effect should be played on loop.
     * @param autoPlaying - whether or not the sound effect should be played immediately.
     * @param spatialize - whether or not the sound effect should be spatialized.
     * @param vol - the volume at which to set the clip.
     * @param path - a path for loading the media of the sound effect.
     * @param onProgress - an optional callback function to use for tracking progress of loading the clip.
     */
    async createClip(id: string, looping: boolean, autoPlaying: boolean, spatialize: boolean, vol: number, path: string, onProgress?: progressCallback): Promise<IPlayableSource> {
        if (path == null || path.length === 0) {
            throw new Error("No clip source path provided");
        }

        const clip = useElementSourceForClips
            ? await this.createAudioElementSource(id, looping, autoPlaying, spatialize, path, onProgress)
            : await this.createAudioBufferSource(id, looping, autoPlaying, spatialize, path, onProgress);

        clip.volume = vol;

        this.clips.set(id, clip);

        return clip;
    }

    private async getAudioBlob(path: string, onProgress: progressCallback): Promise<Blob> {
        let goodBlob: Blob = null;
        if (!shouldTry(path)) {
            if (onProgress) {
                onProgress(1, 1, "skip");
            }
        }
        else {
            const blob = await this.fetcher.getBlob(path, null, onProgress);
            if (testAudio.canPlayType(blob.type)) {
                goodBlob = blob;
            }
        }

        if (!goodBlob) {
            throw new Error("Cannot play file: " + path);
        }

        return goodBlob;
    }

    private async createAudioElementSource(id: string, looping: boolean, autoPlaying: boolean, spatialize: boolean, path: string, onProgress?: progressCallback): Promise<IPlayableSource> {
        if (onProgress) {
            onProgress(0, 1);
        }

        const blob = await this.getAudioBlob(path, onProgress);
        const file = URL.createObjectURL(blob);
        const elem = BackgroundAudio(
            autoPlaying,
            false,
            loop(looping),
            src(file));
        await once(elem, "canplaythrough", "error");
        const source = MediaElementSource("audio-element-source-" + id, elem);
        if (onProgress) {
            onProgress(1, 1);
        }

        return new AudioElementSource("audio-clip-" + id, source, this.createSpatializer(spatialize, false));
    }

    private async createAudioBufferSource(id: string, looping: boolean, autoPlaying: boolean, spatialize: boolean, path: string, onProgress?: progressCallback): Promise<IPlayableSource> {
        let goodBlob: Blob = await this.getAudioBlob(path, onProgress);

        const b = await goodBlob.arrayBuffer();
        const data = await decodeAudioData(b);
        const source = BufferSource(
            "audio-buffer-source-" + id,
            buffer(data),
            loopAudio(looping)
        );

        const clip = new AudioBufferSpawningSource("audio-clip-" + id, source, this.createSpatializer(spatialize, false));

        if (autoPlaying) {
            clip.play();
        }

        return clip;
    }

    hasClip(name: string): boolean {
        return this.clips.has(name);
    }

    /**
     * Plays a named sound effect.
     * @param name - the name of the effect to play.
     */
    async playClip(name: string): Promise<void> {
        if (this.isReady && this.hasClip(name)) {
            const clip = this.clips.get(name);
            await clip.play();
        }
    }

    stopClip(name: string): void {
        if (this.isReady && this.hasClip(name)) {
            const clip = this.clips.get(name);
            clip.stop();
        }
    }

    /**
     * Get an existing user.
     */
    getUser(id: string): AudioStreamSource {
        return this.users.get(id);
    }

    /**
     * Get an existing audio clip.
     */
    getClip(id: string): IPlayableSource {
        return this.clips.get(id);
    }

    renameClip(id: string, newID: string): void {
        const clip = this.clips.get(id);
        if (clip) {
            clip.id = "audio-clip-" + id;
            this.clips.delete(id);
            this.clips.set(newID, clip);
        }
    }

    /**
     * Remove an audio source from audio processing.
     * @param sources - the collection of audio sources from which to remove.
     * @param id - the id of the audio source to remove
     **/
    private removeSource<T extends IDisposable>(sources: Map<string, T>, id: string): T {
        const source = sources.get(id);
        if (source) {
            sources.delete(id);
            source.dispose();
        }

        return source;
    }

    /**
     * Remove a user from audio processing.
     **/
    removeUser(id: string): void {
        this.removeSource(this.users, id);
        arrayRemove(this.sortedUserIDs, id);
        this.updateUserOffsets();
    }

    /**
     * Remove an audio clip from audio processing.
     **/
    removeClip(id: string): IPlayableSource {
        return this.removeSource(this.clips, id);
    }

    private createSourceFromStream(stream: MediaStream): AudioStreamSourceNode {
        if (useTrackSource) {
            const tracks = stream.getAudioTracks()
                .map((track) =>
                    MediaStreamTrackSource("track-source-" + track.id, track));
            if (tracks.length === 0) {
                throw new Error("No audio tracks!");
            }
            else if (tracks.length === 1) {
                return tracks[0];
            }
            else {
                const merger = ChannelMerger(
                    "track-merger-" + stream.id,
                    tracks.length);
                for (const track of tracks) {
                    connect(track, merger);
                }
                return merger;
            }
        }
        else {
            const elem = BackgroundAudio(true, !useElementSourceForUsers);

            elem.srcObject = stream;
            elem.play();

            if (useElementSourceForUsers) {
                return MediaElementSource("media-element-source-" + stream.id, elem);
            }
            else {
                elem.muted = true;
                return MediaStreamSource("media-stream-source-" + stream.id, stream);
            }
        }
    }

    setUserStream(id: string, stream: MediaStream): void {
        if (this.users.has(id)) {
            const user = this.users.get(id);
            user.spatializer = null;

            if (stream) {
                user.source = this.createSourceFromStream(stream);
                user.spatializer = this.createSpatializer(true, true);
                user.spatializer.setAudioProperties(this.minDistance, this.maxDistance, this.rolloff, this.algorithm, this.transitionTime);
            }
        }
    }

    updateUserOffsets(): void {
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
    setAudioProperties(minDistance: number, maxDistance: number, rolloff: number, algorithm: string, transitionTime: number): void {
        this.minDistance = minDistance;
        this.maxDistance = maxDistance;
        this.transitionTime = transitionTime;
        this.rolloff = rolloff;
        this._algorithm = algorithm;

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
     * @param poseCallback
     */
    private withPose<ElementT extends IPoseable, ResultT>(sources: Map<string, ElementT>, id: string, poseCallback: withPoseCallback<ResultT>): ResultT {
        const source = sources.get(id);
        let pose: InterpolatedPose = null;
        if (source) {
            pose = source.pose;
        }
        else if (id === this.localUserID) {
            pose = this.localOutput.pose;
        }

        if (!pose) {
            return null;
        }

        return poseCallback(pose);
    }

    /**
     * Get a user pose, normalize the transition time, and perform on operation on it, if it exists.
     * @param id - the id of the user for which to perform the operation.
     * @param poseCallback
     */
    private withUser<T>(id: string, poseCallback: withPoseCallback<T>): T {
        return this.withPose(this.users, id, poseCallback);
    }

    /**
     * Set the comfort position offset for a given user.
     * @param id - the id of the user for which to set the offset.
     * @param x - the horizontal component of the offset.
     * @param y - the vertical component of the offset.
     * @param z - the lateral component of the offset.
     */
    private setUserOffset(id: string, x: number, y: number, z: number): void {
        this.withUser(id, (pose) => {
            pose.setOffset(x, y, z);
        });
    }

    /**
     * Get the comfort position offset for a given user.
     * @param id - the id of the user for which to set the offset.
     */
    public getUserOffset(id: string): vec3 {
        return this.withUser(id, pose => pose.offset);
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
    setUserPose(id: string, px: number, py: number, pz: number, fx: number, fy: number, fz: number, ux: number, uy: number, uz: number): void {
        this.withUser(id, (pose) => {
            pose.setTarget(px, py, pz, fx, fy, fz, ux, uy, uz, this.currentTime, this.transitionTime);
        });
    }

    /**
     * Get an audio clip pose, normalize the transition time, and perform on operation on it, if it exists.
     * @param id - the id of the audio clip for which to perform the operation.
     * @param dt - the amount of time to take to make the transition. Defaults to this AudioManager's `transitionTime`.
     * @param poseCallback
     */
    private withClip<T>(id: string, poseCallback: withPoseCallback<T>): T {
        return this.withPose(this.clips, id, poseCallback);
    }

    /**
     * Set the position of an audio clip.
     * @param id - the id of the audio clip for which to set the position.
     * @param x - the horizontal component of the position.
     * @param y - the vertical component of the position.
     * @param z - the lateral component of the position.
     **/
    setClipPosition(id: string, x: number, y: number, z: number): void {
        this.withClip(id, (pose) => {
            pose.setTargetPosition(x, y, z, this.currentTime, this.transitionTime);
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
     **/
    setClipOrientation(id: string, fx: number, fy: number, fz: number, ux: number, uy: number, uz: number): void {
        this.withClip(id, (pose) => {
            pose.setTargetOrientation(fx, fy, fz, ux, uy, uz, this.currentTime, this.transitionTime);
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
     **/
    setClipPose(id: string, px: number, py: number, pz: number, fx: number, fy: number, fz: number, ux: number, uy: number, uz: number): void {
        this.withClip(id, (pose) => {
            pose.setTarget(px, py, pz, fx, fy, fz, ux, uy, uz, this.currentTime, 0.5);
        });
    }
}