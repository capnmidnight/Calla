import { arrayScan } from "kudzu/arrays/arrayScan";
import { arraySortByKey } from "kudzu/arrays/arraySortedInsert";
import { TypedEvent, TypedEventBase } from "kudzu/events/EventBase";
import { autoPlay, playsInline } from "kudzu/html/attrs";
import { display, styles } from "kudzu/html/css";
import { Audio } from "kudzu/html/tags";
import { isDefined, isFunction, isNullOrUndefined } from "kudzu/typeChecks";
/**
 * Indicates whether or not the current browser can change the destination device for audio output.
 **/
export const canChangeAudioOutput = isFunction(HTMLAudioElement.prototype.setSinkId);
function filterDeviceDuplicates(devices) {
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
export class DeviceManagerInputsChangedEvent extends TypedEvent {
    audio;
    video;
    constructor(audio, video) {
        super("inputschanged");
        this.audio = audio;
        this.video = video;
    }
}
export class DeviceManagerAudioOutputChangedEvent extends TypedEvent {
    device;
    constructor(device) {
        super("audiooutputchanged");
        this.device = device;
    }
}
const PREFERRED_AUDIO_OUTPUT_ID_KEY = "calla:preferredAudioOutputID";
const PREFERRED_AUDIO_INPUT_ID_KEY = "calla:preferredAudioInputID";
const PREFERRED_VIDEO_INPUT_ID_KEY = "calla:preferredVideoInputID";
export class DeviceManager extends TypedEventBase {
    needsVideoDevice;
    element = null;
    _hasAudioPermission = false;
    get hasAudioPermission() {
        return this._hasAudioPermission;
    }
    _hasVideoPermission = false;
    get hasVideoPermission() {
        return this._hasVideoPermission;
    }
    _currentStream = null;
    get currentStream() {
        return this._currentStream;
    }
    set currentStream(v) {
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
    constructor(needsVideoDevice = false) {
        super();
        this.needsVideoDevice = needsVideoDevice;
        if (canChangeAudioOutput) {
            this.element = Audio(playsInline, autoPlay, styles(display("none")));
            document.body.appendChild(this.element);
        }
    }
    async setDestination(destination) {
        try {
            if (canChangeAudioOutput && destination.stream !== this.element.srcObject) {
                this.element.srcObject = destination.stream;
                const devices = await this.getAudioOutputDevices();
                const device = arrayScan(devices, (d) => d.deviceId === this.preferredAudioOutputID, (d) => d.deviceId === "default", (d) => d.deviceId.length > 0);
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
    async start() {
        await this.enablePreferredAudioInput();
        await this.enablePreferredVideoInput();
    }
    async enablePreferredAudioInput() {
        const device = await this.getPreferredAudioInput();
        if (device) {
            await this.setAudioInputDevice(device);
        }
    }
    async enablePreferredVideoInput() {
        const device = await this.getPreferredVideoInput();
        if (device) {
            await this.setVideoInputDevice(device);
        }
    }
    get preferredAudioOutputID() {
        if (!canChangeAudioOutput) {
            return null;
        }
        return localStorage.getItem(PREFERRED_AUDIO_OUTPUT_ID_KEY);
    }
    setPreferredAudioOutputID(v) {
        if (canChangeAudioOutput) {
            localStorage.setItem(PREFERRED_AUDIO_OUTPUT_ID_KEY, v);
        }
    }
    get preferredAudioInputID() {
        return localStorage.getItem(PREFERRED_AUDIO_INPUT_ID_KEY);
    }
    setPreferredAudioInputID(v) {
        localStorage.setItem(PREFERRED_AUDIO_INPUT_ID_KEY, v);
    }
    get preferredVideoInputID() {
        return localStorage.getItem(PREFERRED_VIDEO_INPUT_ID_KEY);
    }
    setPreferredVideoInputID(v) {
        localStorage.setItem(PREFERRED_VIDEO_INPUT_ID_KEY, v);
    }
    async getAudioOutputDevices(filterDuplicates = false) {
        if (!canChangeAudioOutput) {
            return [];
        }
        const devices = await this.getAvailableDevices(filterDuplicates);
        return devices && devices.audioOutput || [];
    }
    async getAudioInputDevices(filterDuplicates = false) {
        const devices = await this.getAvailableDevices(filterDuplicates);
        return devices && devices.audioInput || [];
    }
    async getVideoInputDevices(filterDuplicates = false) {
        const devices = await this.getAvailableDevices(filterDuplicates);
        return devices && devices.videoInput || [];
    }
    async getAudioOutputDevice() {
        if (!canChangeAudioOutput) {
            return null;
        }
        const curId = this.element && this.element.sinkId;
        if (isNullOrUndefined(curId)) {
            return null;
        }
        const devices = await this.getAudioOutputDevices(), device = arrayScan(devices, d => d.deviceId === curId);
        return device;
    }
    async getAudioInputDevice() {
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
        const device = arrayScan(devices, d => testTrack.label === d.label);
        return device;
    }
    async getVideoInputDevice() {
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
        const device = arrayScan(devices, d => testTrack.label === d.label);
        return device;
    }
    async getPreferredAudioInput() {
        const devices = await this.getAudioInputDevices();
        const device = arrayScan(devices, (d) => d.deviceId === this.preferredAudioInputID, (d) => d.deviceId === "default", (d) => d.deviceId.length > 0);
        return device;
    }
    async getPreferredVideoInput() {
        const devices = await this.getVideoInputDevices();
        const device = arrayScan(devices, (d) => d.deviceId === this.preferredVideoInputID, (d) => this.needsVideoDevice && d.deviceId.length > 0);
        return device;
    }
    async setAudioOutputDevice(device) {
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
    async setAudioInputDevice(newAudio) {
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
    async setVideoInputDevice(newVideo) {
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
    async getAvailableDevices(filterDuplicates = false) {
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
    async getDevices() {
        let devices = null;
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
    async getMediaPermissions() {
        await this.getDevices();
        return {
            audio: this.hasAudioPermission,
            video: this.hasVideoPermission
        };
    }
}
//# sourceMappingURL=DeviceManager.js.map