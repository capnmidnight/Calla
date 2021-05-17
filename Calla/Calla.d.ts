import { TypedEventBase } from "kudzu/events/EventBase";
import type { IFetcher } from "kudzu/io/IFetcher";
import type { IDisposable } from "kudzu/using";
import type { AudioManager } from "./audio/AudioManager";
import { MediaPermissionSet } from "./audio/MediaDevices";
import type { CallaClientEvents } from "./CallaEvents";
import { ConnectionState } from "./ConnectionState";
import type { ICombinedClient } from "./ICombinedClient";
import type { IMetadataClient, IMetadataClientExt } from "./meta/IMetadataClient";
import type { ITeleconferenceClient, ITeleconferenceClientExt } from "./tele/ITeleconferenceClient";
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
    private _fetcher;
    private _tele;
    private _meta;
    isAudioMuted: boolean;
    isVideoMuted: boolean;
    constructor(_fetcher: IFetcher, _tele: ITeleconferenceClientExt, _meta: IMetadataClientExt);
    get connectionState(): ConnectionState;
    get conferenceState(): ConnectionState;
    get fetcher(): IFetcher;
    get tele(): ITeleconferenceClient;
    get meta(): IMetadataClient;
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
    private disposed;
    dispose(): void;
    get offsetRadius(): number;
    set offsetRadius(v: number);
    setLocalPose(px: number, py: number, pz: number, fx: number, fy: number, fz: number, ux: number, uy: number, uz: number): void;
    tellLocalPose(userid: string, px: number, py: number, pz: number, fx: number, fy: number, fz: number, ux: number, uy: number, uz: number): void;
    setLocalPointer(name: string, px: number, py: number, pz: number, fx: number, fy: number, fz: number, ux: number, uy: number, uz: number): void;
    setAvatarEmoji(emoji: string): void;
    tellAvatarEmoji(userid: string, emoji: string): void;
    setAvatarURL(url: string): void;
    tellAvatarURL(userid: string, url: string): void;
    emote(emoji: string): void;
    chat(text: string): void;
    enablePreferredDevices(): Promise<void>;
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
    connect(): Promise<void>;
    join(roomName: string): Promise<void>;
    identify(userName: string): Promise<void>;
    leave(): Promise<void>;
    disconnect(): Promise<void>;
    setAudioOutputDevice(device: MediaDeviceInfo): Promise<void>;
    setAudioMuted(muted: boolean): Promise<boolean>;
    setVideoMuted(muted: boolean): Promise<boolean>;
}
