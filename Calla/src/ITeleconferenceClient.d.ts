import type { HubConnectionState } from "@microsoft/signalr";
import type { progressCallback, TypedEventBase } from "kudzu";
import type { AudioManager } from "./audio/AudioManager";
import type { MediaPermissionSet } from "./Calla";
import type { CallaTeleconferenceEvents } from "./CallaEvents";
import type { IClient } from "./IClient";
import type { IMetadataClientExt } from "./IMetadataClient";
export interface ITeleconferenceClient extends TypedEventBase<CallaTeleconferenceEvents>, IClient {
    audio: AudioManager;
    localUserID: string;
    localUserName: string;
    roomName: string;
    userExists(id: string): boolean;
    getUserNames(): string[][];
    connectionState: HubConnectionState;
    conferenceState: HubConnectionState;
    /**
     * Get the client ready to connect to the teleconferencing server.
     * @param JITSI_HOST
     * @param JVB_HOST
     * @param JVB_MUC
     * @param onProgress
     */
    prepare(JITSI_HOST: string, JVB_HOST: string, JVB_MUC: string, onProgress?: progressCallback): Promise<void>;
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
