import type { TypedEventBase } from "kudzu/events/EventBase";
import type { AudioManager } from "../audio/AudioManager";
import type { MediaPermissionSet } from "../Calla";
import type { CallaTeleconferenceEvents } from "../CallaEvents";
import type { ConnectionState } from "../ConnectionState";
import type { IClient } from "../IClient";
import type { IMetadataClientExt } from "../meta/IMetadataClient";

export interface ITeleconferenceClient
    extends TypedEventBase<CallaTeleconferenceEvents>, IClient {

    audio: AudioManager;
    localUserID: string;
    localUserName: string;
    roomName: string;

    userExists(id: string): boolean;

    getUserNames(): string[][];

    connectionState: ConnectionState;
    conferenceState: ConnectionState;

    preferredAudioOutputID: string;
    preferredAudioInputID: string;
    preferredVideoInputID: string;

    setPreferredDevices(): Promise<void>;

    getAudioOutputDevices(filterDuplicates: boolean): Promise<MediaDeviceInfo[]>;
    getAudioInputDevices(filterDuplicates: boolean): Promise<MediaDeviceInfo[]>;
    getVideoInputDevices(filterDuplicates: boolean): Promise<MediaDeviceInfo[]>;

    setAudioOutputDevice(device: MediaDeviceInfo): Promise<void>;
    setAudioInputDevice(device: MediaDeviceInfo): Promise<void>;
    setVideoInputDevice(device: MediaDeviceInfo): Promise<void>;

    getCurrentAudioOutputDevice(): Promise<MediaDeviceInfo>;
    getCurrentAudioInputDevice(): Promise<MediaDeviceInfo>;
    getCurrentVideoInputDevice(): Promise<MediaDeviceInfo>;

    toggleAudioMuted(): Promise<boolean>;
    toggleVideoMuted(): Promise<boolean>;

    getAudioMuted(): Promise<boolean>;
    getVideoMuted(): Promise<boolean>;

    getMediaPermissions(): Promise<MediaPermissionSet>;
}

export interface ITeleconferenceClientExt extends ITeleconferenceClient {
    getNext<T extends keyof CallaTeleconferenceEvents>(evtName: T, userID: string): Promise<CallaTeleconferenceEvents[T]>;
    getDefaultMetadataClient(): IMetadataClientExt;
}
