import { TypedEvent, TypedEventBase } from "kudzu/events/EventBase";
import { MediaPermissionSet } from "./MediaPermissionSet";
/**
 * Indicates whether or not the current browser can change the destination device for audio output.
 **/
export declare const canChangeAudioOutput: boolean;
export declare class DeviceManagerInputsChangedEvent extends TypedEvent<"inputschanged"> {
    readonly audio: MediaDeviceInfo;
    readonly video: MediaDeviceInfo;
    constructor(audio: MediaDeviceInfo, video: MediaDeviceInfo);
}
export declare class DeviceManagerAudioOutputChangedEvent extends TypedEvent<"audiooutputchanged"> {
    readonly device: MediaDeviceInfo;
    constructor(device: MediaDeviceInfo);
}
export declare class DeviceManager extends TypedEventBase<{
    inputschanged: DeviceManagerInputsChangedEvent;
    audiooutputchanged: DeviceManagerAudioOutputChangedEvent;
}> {
    needsVideoDevice: boolean;
    private element;
    private _hasAudioPermission;
    get hasAudioPermission(): boolean;
    private _hasVideoPermission;
    get hasVideoPermission(): boolean;
    private _currentStream;
    get currentStream(): MediaStream;
    set currentStream(v: MediaStream);
    constructor(needsVideoDevice?: boolean);
    setDestination(destination: MediaStreamAudioDestinationNode): Promise<void>;
    start(): Promise<void>;
    enablePreferredAudioInput(): Promise<void>;
    enablePreferredVideoInput(): Promise<void>;
    get preferredAudioOutputID(): string;
    private setPreferredAudioOutputID;
    get preferredAudioInputID(): string;
    private setPreferredAudioInputID;
    get preferredVideoInputID(): string;
    private setPreferredVideoInputID;
    getAudioOutputDevices(filterDuplicates?: boolean): Promise<MediaDeviceInfo[]>;
    getAudioInputDevices(filterDuplicates?: boolean): Promise<MediaDeviceInfo[]>;
    getVideoInputDevices(filterDuplicates?: boolean): Promise<MediaDeviceInfo[]>;
    getAudioOutputDevice(): Promise<MediaDeviceInfo>;
    getAudioInputDevice(): Promise<MediaDeviceInfo>;
    getVideoInputDevice(): Promise<MediaDeviceInfo>;
    private getPreferredAudioInput;
    private getPreferredVideoInput;
    setAudioOutputDevice(device: MediaDeviceInfo): Promise<void>;
    setAudioInputDevice(newAudio: MediaDeviceInfo): Promise<void>;
    setVideoInputDevice(newVideo: MediaDeviceInfo): Promise<void>;
    private getAvailableDevices;
    private getDevices;
    getMediaPermissions(): Promise<MediaPermissionSet>;
}
