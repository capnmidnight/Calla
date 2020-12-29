import type { vec3 } from "gl-matrix";
import type { blobFetchingCallback, progressCallback } from "kudzu";
import { TypedEventBase } from "kudzu";
import { AudioActivityEvent } from "./AudioActivityEvent";
import { AudioSource } from "./AudioSource";
import type { BaseNode } from "./spatializers/nodes/BaseNode";
interface AudioManagerEvents {
    audioready: Event;
    audioActivity: AudioActivityEvent;
}
export declare enum SpatializerType {
    Low = "volumescale",
    Medium = "webaudiopanner",
    High = "resonance"
}
/**
 * A manager of audio sources, destinations, and their spatialization.
 **/
export declare class AudioManager extends TypedEventBase<AudioManagerEvents> {
    private type;
    private getBlob;
    private minDistance;
    private maxDistance;
    private rolloff;
    private algorithm;
    private transitionTime;
    private _offsetRadius;
    private clips;
    private users;
    private analysers;
    private sortedUserIDs;
    private localUserID;
    private listener;
    private audioContext;
    private element;
    private destination;
    private _audioOutputDeviceID;
    private onAudioActivity;
    /**
     * Creates a new manager of audio sources, destinations, and their spatialization.
     **/
    constructor(type: SpatializerType, getBlob: blobFetchingCallback);
    get offsetRadius(): number;
    set offsetRadius(v: number);
    addEventListener<K extends string & keyof AudioManagerEvents>(type: K, callback: (evt: Event & AudioManagerEvents[K]) => any, options?: AddEventListenerOptions): void;
    get ready(): boolean;
    /**
     * Perform the audio system initialization, after a user gesture
     **/
    start(): Promise<void>;
    update(): void;
    /**
     * If no audio context is currently available, creates one, and initializes the
     * spatialization of its listener.
     *
     * If WebAudio isn't available, a mock audio context is created that provides
     * ersatz playback timing.
     **/
    createContext(): void;
    getAudioOutputDeviceID(): string;
    setAudioOutputDeviceID(deviceID: string): Promise<void>;
    /**
     * Creates a spatialzer for an audio source.
     * @param id
     * @param source - the audio element that is being spatialized.
     * @param spatialize - whether or not the audio stream should be spatialized. Stereo audio streams that are spatialized will get down-mixed to a single channel.
     */
    createSpatializer(id: string, source: AudioNode, spatialize: boolean): BaseNode;
    /**
     * Gets the current playback time.
     */
    get currentTime(): number;
    /**
     * Create a new user for audio processing.
     */
    createUser(id: string): AudioSource;
    /**
     * Create a new user for the audio listener.
     */
    createLocalUser(id: string): AudioSource;
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
    createClip(name: string, looping: boolean, autoPlaying: boolean, spatialize: boolean, vol: number, path: string, onProgress?: progressCallback): Promise<AudioSource>;
    hasClip(name: string): boolean;
    /**
     * Plays a named sound effect.
     * @param name - the name of the effect to play.
     */
    playClip(name: string): Promise<void>;
    stopClip(name: string): void;
    /**
     * Get an audio source.
     * @param sources - the collection of audio sources from which to retrieve.
     * @param id - the id of the audio source to get
     **/
    private getSource;
    /**
     * Get an existing user.
     */
    getUser(id: string): AudioSource;
    /**
     * Get an existing audio clip.
     */
    getClip(id: string): AudioSource;
    /**
     * Remove an audio source from audio processing.
     * @param sources - the collection of audio sources from which to remove.
     * @param id - the id of the audio source to remove
     **/
    private removeSource;
    /**
     * Remove a user from audio processing.
     **/
    removeUser(id: string): void;
    /**
     * Remove an audio clip from audio processing.
     **/
    removeClip(id: string): void;
    private createSourceFromStream;
    setUserStream(id: string, stream: MediaStream): Promise<void>;
    updateUserOffsets(): void;
    /**
     * Sets parameters that alter spatialization.
     **/
    setAudioProperties(minDistance: number, maxDistance: number, rolloff: number, algorithm: string, transitionTime: number): void;
    /**
     * Get a pose, normalize the transition time, and perform on operation on it, if it exists.
     * @param sources - the collection of poses from which to retrieve the pose.
     * @param id - the id of the pose for which to perform the operation.
     * @param dt - the amount of time to take to make the transition. Defaults to this AudioManager's `transitionTime`.
     * @param poseCallback
     */
    private withPose;
    /**
     * Get a user pose, normalize the transition time, and perform on operation on it, if it exists.
     * @param id - the id of the user for which to perform the operation.
     * @param dt - the amount of time to take to make the transition. Defaults to this AudioManager's `transitionTime`.
     * @param poseCallback
     */
    private withUser;
    /**
     * Set the comfort position offset for a given user.
     * @param id - the id of the user for which to set the offset.
     * @param x - the horizontal component of the offset.
     * @param y - the vertical component of the offset.
     * @param z - the lateral component of the offset.
     */
    private setUserOffset;
    /**
     * Get the comfort position offset for a given user.
     * @param id - the id of the user for which to set the offset.
     */
    getUserOffset(id: string): vec3;
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
    setUserPose(id: string, px: number, py: number, pz: number, fx: number, fy: number, fz: number, ux: number, uy: number, uz: number, dt?: number): void;
    /**
     * Get an audio clip pose, normalize the transition time, and perform on operation on it, if it exists.
     * @param id - the id of the audio clip for which to perform the operation.
     * @param dt - the amount of time to take to make the transition. Defaults to this AudioManager's `transitionTime`.
     * @param poseCallback
     */
    private withClip;
    /**
     * Set the position of an audio clip.
     * @param id - the id of the audio clip for which to set the position.
     * @param x - the horizontal component of the position.
     * @param y - the vertical component of the position.
     * @param z - the lateral component of the position.
     * @param dt - the amount of time to take to make the transition. Defaults to this AudioManager's `transitionTime`.
     **/
    setClipPosition(id: string, x: number, y: number, z: number, dt?: number): void;
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
    setClipOrientation(id: string, fx: number, fy: number, fz: number, ux: number, uy: number, uz: number, dt?: number): void;
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
    setClipPose(id: string, px: number, py: number, pz: number, fx: number, fy: number, fz: number, ux: number, uy: number, uz: number, dt?: number): void;
}
export {};
