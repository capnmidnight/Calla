import { arrayScan } from "kudzu/arrays/arrayScan";
import type { ErsatzEventTarget } from "kudzu/events/ErsatzEventTarget";
import { TypedEventBase } from "kudzu/events/EventBase";
import { IFetcher } from "kudzu/io/IFetcher";
import { AudioManager } from "../audio/AudioManager";
import { canChangeAudioOutput } from "../audio/canChangeAudioOutput";
import type { MediaDeviceSet, MediaPermissionSet } from "../Calla";
import type { CallaTeleconferenceEvents } from "../CallaEvents";
import { CallaUserEvent } from "../CallaEvents";
import { ConnectionState } from "../ConnectionState";
import type { ITeleconferenceClientExt } from "./ITeleconferenceClient";

export function addLogger(obj: ErsatzEventTarget, evtName: string): void {
    obj.addEventListener(evtName, (...rest: any[]) => {
        if (loggingEnabled) {
            console.log(">== CALLA ==<", evtName, ...rest);
        }
    });
}


function filterDeviceDuplicates(devices: MediaDeviceInfo[]) {
    const filtered = [];
    for (let i = 0; i < devices.length; ++i) {
        const a = devices[i];
        let found = false;
        for (let j = 0; j < filtered.length && !found; ++j) {
            const b = filtered[j];
            found = a.kind === b.kind && b.label.indexOf(a.label) > 0;
        }

        if (!found) {
            filtered.push(a);
        }
    }

    return filtered;
}

const PREFERRED_AUDIO_OUTPUT_ID_KEY = "calla:preferredAudioOutputID";
const PREFERRED_AUDIO_INPUT_ID_KEY = "calla:preferredAudioInputID";
const PREFERRED_VIDEO_INPUT_ID_KEY = "calla:preferredVideoInputID";

export const DEFAULT_LOCAL_USER_ID = "local-user";

let loggingEnabled = window.location.hostname === "localhost"
    || /\bdebug\b/.test(window.location.search);

export abstract class BaseTeleconferenceClient
    extends TypedEventBase<CallaTeleconferenceEvents>
    implements ITeleconferenceClientExt {

    toggleLogging() {
        loggingEnabled = !loggingEnabled;
    }

    localUserID: string = null;
    localUserName: string = null;
    roomName: string = null;

    protected fetcher: IFetcher;

    audio: AudioManager;

    private _connectionState = ConnectionState.Disconnected;
    private _conferenceState = ConnectionState.Disconnected;

    hasAudioPermission = false;
    hasVideoPermission = false;

    get connectionState(): ConnectionState {
        return this._connectionState;
    }

    private setConnectionState(state: ConnectionState): void {
        this._connectionState = state;
    }

    get conferenceState(): ConnectionState {
        return this._conferenceState;
    }

    private setConferenceState(state: ConnectionState): void {
        this._conferenceState = state;
    }

    constructor(fetcher: IFetcher, audio: AudioManager, public needsAudioDevice = true, public needsVideoDevice = false) {
        super();

        this.fetcher = fetcher;

        this.audio = audio;

        this.addEventListener("serverConnected", this.setConnectionState.bind(this, ConnectionState.Connected));
        this.addEventListener("serverFailed", this.setConnectionState.bind(this, ConnectionState.Disconnected));
        this.addEventListener("serverDisconnected", this.setConnectionState.bind(this, ConnectionState.Disconnected));

        this.addEventListener("conferenceJoined", this.setConferenceState.bind(this, ConnectionState.Connected));
        this.addEventListener("conferenceFailed", this.setConferenceState.bind(this, ConnectionState.Disconnected));
        this.addEventListener("conferenceRestored", this.setConferenceState.bind(this, ConnectionState.Connected));
        this.addEventListener("conferenceLeft", this.setConferenceState.bind(this, ConnectionState.Disconnected));
    }

    protected onDispatching<T extends Event>(evt: T) {
        if (evt instanceof CallaUserEvent
            && (evt.id == null
                || evt.id === "local")) {
            if (this.localUserID === DEFAULT_LOCAL_USER_ID) {
                evt.id = null;
            }
            else {
                evt.id = this.localUserID;
            }
        }
    }

    async getNext<T extends keyof CallaTeleconferenceEvents>(evtName: T, userID: string): Promise<CallaTeleconferenceEvents[T]> {
        return new Promise((resolve) => {
            const getter = (evt: CallaTeleconferenceEvents[T]) => {
                if (evt instanceof CallaUserEvent
                    && evt.id === userID) {
                    this.removeEventListener(evtName, getter);
                    resolve(evt);
                }
            };

            this.addEventListener(evtName, getter);
        });
    }



    get preferredAudioInputID(): string {
        return localStorage.getItem(PREFERRED_AUDIO_INPUT_ID_KEY);
    }

    set preferredAudioInputID(v: string) {
        localStorage.setItem(PREFERRED_AUDIO_INPUT_ID_KEY, v);
    }

    get preferredVideoInputID(): string {
        return localStorage.getItem(PREFERRED_VIDEO_INPUT_ID_KEY);
    }

    set preferredVideoInputID(v: string) {
        localStorage.setItem(PREFERRED_VIDEO_INPUT_ID_KEY, v);
    }

    async setPreferredDevices(): Promise<void> {
        await this.setPreferredAudioInput(true);
        await this.setPreferredVideoInput(false);
        await this.setPreferredAudioOutput(true);
    }

    async getPreferredAudioInput(allowAny: boolean): Promise<MediaDeviceInfo> {
        const devices = await this.getAudioInputDevices();
        const device = arrayScan(
            devices,
            (d) => d.deviceId === this.preferredAudioInputID,
            (d) => d.deviceId === "communications",
            (d) => d.deviceId === "default",
            (d) => allowAny && d.deviceId.length > 0);
        return device;
    }

    async setPreferredAudioInput(allowAny: boolean): Promise<void> {
        const device = await this.getPreferredAudioInput(allowAny);
        if (device) {
            await this.setAudioInputDevice(device);
        }
    }

    async getPreferredVideoInput(allowAny: boolean): Promise<MediaDeviceInfo> {
        const devices = await this.getVideoInputDevices();
        const device = arrayScan(devices,
            (d) => d.deviceId === this.preferredVideoInputID,
            (d) => allowAny && d && /front/i.test(d.label),
            (d) => allowAny && d.deviceId.length > 0);
        return device;
    }

    async setPreferredVideoInput(allowAny: boolean): Promise<void> {
        const device = await this.getPreferredVideoInput(allowAny);
        if (device) {
            await this.setVideoInputDevice(device);
        }
    }

    private async getDevices(): Promise<MediaDeviceInfo[]> {
        let devices: MediaDeviceInfo[] = null;
        for (let i = 0; i < 3; ++i) {
            devices = await navigator.mediaDevices.enumerateDevices();
            for (const device of devices) {
                if (device.deviceId.length > 0) {
                    this.hasAudioPermission = this.hasAudioPermission || device.kind === "audioinput" && device.label.length > 0;
                    this.hasVideoPermission = this.hasVideoPermission || device.kind === "videoinput" && device.label.length > 0;
                }
            }

            if (this.hasAudioPermission) {
                break;
            }

            try {
                await navigator.mediaDevices.getUserMedia({
                    audio: this.needsAudioDevice && !this.hasAudioPermission,
                    video: this.needsVideoDevice && !this.hasVideoPermission
                });
            }
            catch (exp) {
                console.warn(exp);
            }
        }

        return devices || [];
    }

    async getMediaPermissions(): Promise<MediaPermissionSet> {
        await this.getDevices();
        return {
            audio: this.hasAudioPermission,
            video: this.hasVideoPermission
        };
    }

    private async getAvailableDevices(filterDuplicates: boolean = false): Promise<MediaDeviceSet> {
        let devices = await this.getDevices();

        if (filterDuplicates) {
            devices = filterDeviceDuplicates(devices);
        }

        return {
            audioOutput: canChangeAudioOutput ? devices.filter(d => d.kind === "audiooutput") : [],
            audioInput: devices.filter(d => d.kind === "audioinput"),
            videoInput: devices.filter(d => d.kind === "videoinput")
        };
    }

    async getAudioInputDevices(filterDuplicates: boolean = false): Promise<MediaDeviceInfo[]> {
        const devices = await this.getAvailableDevices(filterDuplicates);
        return devices && devices.audioInput || [];
    }

    async getVideoInputDevices(filterDuplicates: boolean = false): Promise<MediaDeviceInfo[]> {
        const devices = await this.getAvailableDevices(filterDuplicates);
        return devices && devices.videoInput || [];
    }

    async setAudioOutputDevice(device: MediaDeviceInfo) {
        if (canChangeAudioOutput) {
            this.preferredAudioOutputID = device && device.deviceId || null;
        }
    }

    async getAudioOutputDevices(filterDuplicates: boolean = false): Promise<MediaDeviceInfo[]> {
        if (!canChangeAudioOutput) {
            return [];
        }
        const devices = await this.getAvailableDevices(filterDuplicates);
        return devices && devices.audioOutput || [];
    }

    async getCurrentAudioOutputDevice() {
        if (!canChangeAudioOutput) {
            return null;
        }
        const curId = this.audio.getAudioOutputDeviceID(),
            devices = await this.getAudioOutputDevices(),
            device = devices.filter((d) => curId != null && d.deviceId === curId
                || curId == null && d.deviceId === this.preferredAudioOutputID);
        if (device.length === 0) {
            return null;
        }
        else {
            return device[0];
        }
    }

    get preferredAudioOutputID(): string {
        return localStorage.getItem(PREFERRED_AUDIO_OUTPUT_ID_KEY);
    }

    set preferredAudioOutputID(v: string) {
        localStorage.setItem(PREFERRED_AUDIO_OUTPUT_ID_KEY, v);
    }


    async getPreferredAudioOutput(allowAny: boolean): Promise<MediaDeviceInfo> {
        const devices = await this.getAudioOutputDevices();
        const device = arrayScan(
            devices,
            (d) => d.deviceId === this.preferredAudioOutputID,
            (d) => d.deviceId === "communications",
            (d) => d.deviceId === "default",
            (d) => allowAny && d.deviceId.length > 0);
        return device;
    }

    async setPreferredAudioOutput(allowAny: boolean): Promise<void> {
        const device = await this.getPreferredAudioOutput(allowAny);
        if (device) {
            await this.setAudioOutputDevice(device);
        }
    }

    async setAudioInputDevice(device: MediaDeviceInfo): Promise<void> {
        this.preferredAudioInputID = device && device.deviceId || null;
    }

    async setVideoInputDevice(device: MediaDeviceInfo) {
        this.preferredVideoInputID = device && device.deviceId || null;
    }

    async connect(): Promise<void> {
        this.setConnectionState(ConnectionState.Connecting);
    }

    async join(_roomName: string, _password?: string): Promise<void> {
        this.setConferenceState(ConnectionState.Connecting);
    }

    async leave(): Promise<void> {
        this.setConferenceState(ConnectionState.Disconnecting);
    }

    async disconnect(): Promise<void> {
        this.setConnectionState(ConnectionState.Disconnecting);
    }

    abstract userExists(id: string): boolean;
    abstract getUserNames(): string[][];
    abstract identify(userNameOrID: string): Promise<void>;
    abstract getCurrentAudioInputDevice(): Promise<MediaDeviceInfo>;
    abstract getCurrentVideoInputDevice(): Promise<MediaDeviceInfo>;
    abstract toggleAudioMuted(): Promise<boolean>;
    abstract toggleVideoMuted(): Promise<boolean>;
    abstract getAudioMuted(): Promise<boolean>;
    abstract getVideoMuted(): Promise<boolean>;
}
