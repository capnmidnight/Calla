import type { Emoji } from "kudzu/emoji/Emoji";
import { TypedEventBase } from "kudzu/events/EventBase";
import type { blobFetchingCallback, scriptLoadingCallback } from "kudzu/io/fetchingCallback";
import type { progressCallback } from "kudzu/tasks/progressCallback";
import type { IDisposable } from "kudzu/using";
import type { AudioManager } from "./audio/AudioManager";
import type { CallaClientEvents } from "./CallaEvents";
import { ConnectionState } from "./ConnectionState";
import type { ICombinedClient } from "./ICombinedClient";
import type { IMetadataClientExt } from "./meta/IMetadataClient";
import type { ITeleconferenceClient, ITeleconferenceClientExt } from "./tele/ITeleconferenceClient";
export interface MediaPermissionSet {
    audio: boolean;
    video: boolean;
}
export interface MediaDeviceSet {
    audioInput: MediaDeviceInfo[];
    videoInput: MediaDeviceInfo[];
    audioOutput: MediaDeviceInfo[];
}
export declare enum ClientState {
    InConference = "in-conference",
    JoiningConference = "joining-conference",
    Connected = "connected",
    Connecting = "connecting",
    Prepaired = "prepaired",
    Prepairing = "prepairing",
    Unprepared = "unprepaired"
}
export declare class Calla extends TypedEventBase<CallaClientEvents> implements ICombinedClient, IDisposable {
    isAudioMuted: boolean;
    isVideoMuted: boolean;
    tele: ITeleconferenceClientExt;
    meta: IMetadataClientExt;
    constructor(getBlob?: blobFetchingCallback, loadScript?: scriptLoadingCallback, TeleClientType?: new (getBlob: blobFetchingCallback, loadScript: scriptLoadingCallback) => ITeleconferenceClientExt, MetaClientType?: new (tele: ITeleconferenceClient) => IMetadataClientExt);
    get connectionState(): ConnectionState;
    get conferenceState(): ConnectionState;
    get audio(): AudioManager;
    get preferredAudioOutputID(): string;
    set preferredAudioOutputID(v: string);
    get preferredAudioInputID(): string;
    set preferredAudioInputID(v: string);
    get preferredVideoInputID(): string;
    set preferredVideoInputID(v: string);
    getCurrentAudioOutputDevice(): Promise<MediaDeviceInfo>;
    getMediaPermissions(): Promise<MediaPermissionSet>;
    getAudioOutputDevices(filterDuplicates: boolean): Promise<MediaDeviceInfo[]>;
    getAudioInputDevices(filterDuplicates: boolean): Promise<MediaDeviceInfo[]>;
    getVideoInputDevices(filterDuplicates: boolean): Promise<MediaDeviceInfo[]>;
    dispose(): void;
    get offsetRadius(): number;
    set offsetRadius(v: number);
    setLocalPose(px: number, py: number, pz: number, fx: number, fy: number, fz: number, ux: number, uy: number, uz: number): void;
    setLocalPoseImmediate(px: number, py: number, pz: number, fx: number, fy: number, fz: number, ux: number, uy: number, uz: number): void;
    setLocalPointer(name: string, px: number, py: number, pz: number, fx: number, fy: number, fz: number, ux: number, uy: number, uz: number): void;
    setAvatarEmoji(emoji: Emoji): void;
    setAvatarURL(url: string): void;
    emote(emoji: Emoji): void;
    chat(text: string): void;
    setPreferredDevices(): Promise<void>;
    setAudioInputDevice(device: MediaDeviceInfo): Promise<void>;
    setVideoInputDevice(device: MediaDeviceInfo): Promise<void>;
    getCurrentAudioInputDevice(): Promise<MediaDeviceInfo>;
    getCurrentVideoInputDevice(): Promise<MediaDeviceInfo>;
    toggleAudioMuted(): Promise<boolean>;
    toggleVideoMuted(): Promise<boolean>;
    getAudioMuted(): Promise<boolean>;
    getVideoMuted(): Promise<boolean>;
    get metadataState(): ConnectionState;
    get localUserID(): string;
    get localUserName(): string;
    get roomName(): string;
    userExists(id: string): boolean;
    getUserNames(): string[][];
    prepare(JITSI_HOST: string, JVB_HOST: string, JVB_MUC: string, onProgress?: progressCallback): Promise<void>;
    connect(): Promise<void>;
    join(roomName: string): Promise<void>;
    identify(userName: string): Promise<void>;
    leave(): Promise<void>;
    disconnect(): Promise<void>;
    update(): void;
    setAudioOutputDevice(device: MediaDeviceInfo): Promise<void>;
    setAudioMuted(muted: boolean): Promise<boolean>;
    setVideoMuted(muted: boolean): Promise<boolean>;
}
