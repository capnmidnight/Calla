import { arrayScan } from "kudzu/arrays/arrayScan";
import { arraySortByKey } from "kudzu/arrays/arraySortedInsert";
import { TypedEvent, TypedEventBase } from "kudzu/events/EventBase";
import { autoPlay, playsInline } from "kudzu/html/attrs";
import { display, styles } from "kudzu/html/css";
import { Audio, HTMLAudioElementWithSinkID } from "kudzu/html/tags";
import { isDefined, isFunction, isNullOrUndefined } from "kudzu/typeChecks";
import { MediaDeviceSet } from "./MediaDeviceSet";
import { MediaPermissionSet } from "./MediaPermissionSet";

/**
 * Indicates whether or not the current browser can change the destination device for audio output.
 **/
export const canChangeAudioOutput = isFunction((HTMLAudioElement.prototype as any).setSinkId);


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

export class DeviceManagerInputsChangedEvent
    extends TypedEvent<"inputschanged"> {
    public constructor(public readonly audio: MediaDeviceInfo, public readonly video: MediaDeviceInfo) {
        super("inputschanged");
    }
}

export class DeviceManagerAudioOutputChangedEvent
    extends TypedEvent<"audiooutputchanged"> {
    public constructor(public readonly device: MediaDeviceInfo) {
        super("audiooutputchanged");
    }
}

const PREFERRED_AUDIO_OUTPUT_ID_KEY = "calla:preferredAudioOutputID";
const PREFERRED_AUDIO_INPUT_ID_KEY = "calla:preferredAudioInputID";
const PREFERRED_VIDEO_INPUT_ID_KEY = "calla:preferredVideoInputID";

export class DeviceManager
    extends TypedEventBase<{
        inputschanged: DeviceManagerInputsChangedEvent;
        audiooutputchanged: DeviceManagerAudioOutputChangedEvent;
    }> {

    private element: HTMLAudioElementWithSinkID = null;

    private _hasAudioPermission = false;
    get hasAudioPermission(): boolean {
        return this._hasAudioPermission;
    }

    private _hasVideoPermission = false;
    get hasVideoPermission(): boolean {
        return this._hasVideoPermission;
    }

    private _currentStream: MediaStream = null;
    get currentStream(): MediaStream {
        return this._currentStream;
    }

    set currentStream(v: MediaStream) {
        if (v !== this.currentStream) {
            if (isDefined(this.currentStream)
                && this.currentStream.active) {
                for (const track of this.currentStream.getTracks()) {
                    track.stop();
                }
            }

            this._currentStream = v;
        }
    }

    constructor(public needsVideoDevice = false) {
        super();

        if (canChangeAudioOutput) {
            this.element = Audio(
                playsInline,
                autoPlay,
                styles(
                    display("none")));

            document.body.appendChild(this.element);
        }
    }

    async setDestination(destination: MediaStreamAudioDestinationNode): Promise<void> {
        try {
            if (canChangeAudioOutput && destination.stream !== this.element.srcObject) {
                this.element.srcObject = destination.stream;
                const devices = await this.getAudioOutputDevices();
                const device = arrayScan(
                    devices,
                    (d) => d.deviceId === this.preferredAudioOutputID,
                    (d) => d.deviceId === "default",
                    (d) => d.deviceId.length > 0);
                if (device) {
                    await this.setAudioOutputDevice(device);
                }
                await this.element.play();
            }
        }
        catch (exp) {
            console.error(exp);
        }
    }

    async start(): Promise<void> {
        await this.enablePreferredAudioInput();
        await this.enablePreferredVideoInput();
    }

    async enablePreferredAudioInput(): Promise<void> {
        const device = await this.getPreferredAudioInput();
        if (device) {
            await this.setAudioInputDevice(device);
        }
    }

    async enablePreferredVideoInput(): Promise<void> {
        const device = await this.getPreferredVideoInput();
        if (device) {
            await this.setVideoInputDevice(device);
        }
    }

    get preferredAudioOutputID(): string {
        if (!canChangeAudioOutput) {
            return null;
        }

        return localStorage.getItem(PREFERRED_AUDIO_OUTPUT_ID_KEY);
    }

    private setPreferredAudioOutputID(v: string) {
        if (canChangeAudioOutput) {
            localStorage.setItem(PREFERRED_AUDIO_OUTPUT_ID_KEY, v);
        }
    }


    get preferredAudioInputID(): string {
        return localStorage.getItem(PREFERRED_AUDIO_INPUT_ID_KEY);
    }

    private setPreferredAudioInputID(v: string) {
        localStorage.setItem(PREFERRED_AUDIO_INPUT_ID_KEY, v);
    }

    get preferredVideoInputID(): string {
        return localStorage.getItem(PREFERRED_VIDEO_INPUT_ID_KEY);
    }

    private setPreferredVideoInputID(v: string) {
        localStorage.setItem(PREFERRED_VIDEO_INPUT_ID_KEY, v);
    }

    async getAudioOutputDevices(filterDuplicates: boolean = false): Promise<MediaDeviceInfo[]> {
        if (!canChangeAudioOutput) {
            return [];
        }

        const devices = await this.getAvailableDevices(filterDuplicates);
        return devices && devices.audioOutput || [];
    }

    async getAudioInputDevices(filterDuplicates: boolean = false): Promise<MediaDeviceInfo[]> {
        const devices = await this.getAvailableDevices(filterDuplicates);
        return devices && devices.audioInput || [];
    }

    async getVideoInputDevices(filterDuplicates: boolean = false): Promise<MediaDeviceInfo[]> {
        const devices = await this.getAvailableDevices(filterDuplicates);
        return devices && devices.videoInput || [];
    }

    async getAudioOutputDevice(): Promise<MediaDeviceInfo> {
        if (!canChangeAudioOutput) {
            return null;
        }

        const curId = this.element && this.element.sinkId;
        if (isNullOrUndefined(curId)) {
            return null;
        }

        const devices = await this.getAudioOutputDevices(),
            device = arrayScan(devices,
                d => d.deviceId === curId);

        return device;
    }

    async getAudioInputDevice(): Promise<MediaDeviceInfo> {
        if (isNullOrUndefined(this.currentStream)
            || !this.currentStream.active) {
            return null;
        }

        const curTracks = this.currentStream.getAudioTracks();
        if (curTracks.length === 0) {
            return null;
        }

        const testTrack = curTracks[0];
        const devices = await this.getAudioInputDevices();
        const device = arrayScan(devices,
            d => testTrack.label === d.label);

        return device;
    }

    async getVideoInputDevice(): Promise<MediaDeviceInfo> {
        if (isNullOrUndefined(this.currentStream)
            || !this.currentStream.active) {
            return null;
        }

        const curTracks = this.currentStream.getVideoTracks();
        if (curTracks.length === 0) {
            return null;
        }

        const testTrack = curTracks[0];
        const devices = await this.getVideoInputDevices();
        const device = arrayScan(devices,
            d => testTrack.label === d.label);

        return device;
    }

    private async getPreferredAudioInput(): Promise<MediaDeviceInfo> {
        const devices = await this.getAudioInputDevices();
        const device = arrayScan(
            devices,
            (d) => d.deviceId === this.preferredAudioInputID,
            (d) => d.deviceId === "default",
            (d) => d.deviceId.length > 0);
        return device;
    }

    private async getPreferredVideoInput(): Promise<MediaDeviceInfo> {
        const devices = await this.getVideoInputDevices();
        const device = arrayScan(
            devices,
            (d) => d.deviceId === this.preferredVideoInputID,
            (d) => this.needsVideoDevice && d.deviceId.length > 0);
        return device;
    }

    async setAudioOutputDevice(device: MediaDeviceInfo) {
        if (canChangeAudioOutput) {
            if (device.kind !== "audiooutput") {
                throw new Error(`Device is not an audio output device. Was: ${device.kind}. Label: ${device.label}`);
            }

            this.setPreferredAudioOutputID(device && device.deviceId || null);
            const curDevice = this.element;
            const curDeviceID = curDevice && curDevice.sinkId;
            if (this.preferredAudioOutputID !== curDeviceID) {
                if (isDefined(this.preferredAudioOutputID)) {
                    await this.element.setSinkId(this.preferredAudioOutputID);
                }
                this.dispatchEvent(new DeviceManagerAudioOutputChangedEvent(device));
            }
        }
    }

    async setAudioInputDevice(newAudio: MediaDeviceInfo) {
        if (newAudio.kind !== "audioinput") {
            throw new Error(`Device is not an audio input device. Was: ${newAudio.kind}. Label: ${newAudio.label}`);
        }

        this.setPreferredAudioInputID(newAudio && newAudio.deviceId || null);
        const curAudio = await this.getAudioInputDevice();
        const curAudioID = curAudio && curAudio.deviceId;
        if (this.preferredAudioInputID !== curAudioID) {
            const curVideo = await this.getVideoInputDevice();
            this.dispatchEvent(new DeviceManagerInputsChangedEvent(newAudio, curVideo));
        }
    }

    async setVideoInputDevice(newVideo: MediaDeviceInfo) {
        if (newVideo.kind !== "videoinput") {
            throw new Error(`Device is not an video input device. Was: ${newVideo.kind}. Label: ${newVideo.label}`);
        }

        this.setPreferredVideoInputID(newVideo && newVideo.deviceId || null);
        const curVideo = await this.getVideoInputDevice();
        const curVideoID = curVideo && curVideo.deviceId;
        if (this.preferredVideoInputID !== curVideoID) {
            const curAudio = await this.getAudioInputDevice();
            this.dispatchEvent(new DeviceManagerInputsChangedEvent(curAudio, newVideo));
        }
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

    private async getDevices(): Promise<MediaDeviceInfo[]> {
        let devices: MediaDeviceInfo[] = null;

        for (let i = 0; i < 3; ++i) {
            devices = await navigator.mediaDevices.enumerateDevices();
            for (const device of devices) {
                if (device.deviceId.length > 0) {
                    if (!this.hasAudioPermission) {
                        this._hasAudioPermission = device.kind === "audioinput"
                            && device.label.length > 0;
                    }

                    if (this.needsVideoDevice && !this.hasVideoPermission) {
                        this._hasVideoPermission = device.kind === "videoinput"
                            && device.label.length > 0;
                    }
                }
            }

            if (this.hasAudioPermission
                && (!this.needsVideoDevice || this.hasVideoPermission)) {
                break;
            }

            try {
                if (!this.hasAudioPermission
                    || this.needsVideoDevice && !this.hasVideoPermission) {

                    this.currentStream = await navigator.mediaDevices.getUserMedia({
                        audio: this.preferredAudioInputID
                            && { deviceId: this.preferredAudioInputID }
                            || true,
                        video: this.needsVideoDevice
                            && (this.preferredVideoInputID
                                && { deviceId: this.preferredVideoInputID }
                                || true)
                            || false
                    });
                }
            }
            catch (exp) {
                console.warn(exp);
            }
        }

        devices = arraySortByKey(devices || [], d => d.label);
        return devices;
    }

    async getMediaPermissions(): Promise<MediaPermissionSet> {
        await this.getDevices();
        return {
            audio: this.hasAudioPermission,
            video: this.hasVideoPermission
        };
    }
}