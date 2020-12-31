import { HubConnectionState } from "@microsoft/signalr";
import { arrayScan, isOculusQuest, TypedEventBase } from "kudzu";
import { AudioManager, SpatializerType } from "../audio/AudioManager";
import { canChangeAudioOutput } from "../audio/canChangeAudioOutput";
import { CallaTeleconferenceEventType, CallaUserEvent } from "../CallaEvents";
export function addLogger(obj, evtName) {
    obj.addEventListener(evtName, (...rest) => {
        if (loggingEnabled) {
            console.log(">== CALLA ==<", evtName, ...rest);
        }
    });
}
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
const PREFERRED_AUDIO_OUTPUT_ID_KEY = "calla:preferredAudioOutputID";
const PREFERRED_AUDIO_INPUT_ID_KEY = "calla:preferredAudioInputID";
const PREFERRED_VIDEO_INPUT_ID_KEY = "calla:preferredVideoInputID";
export const DEFAULT_LOCAL_USER_ID = "local-user";
let loggingEnabled = window.location.hostname === "localhost"
    || /\bdebug\b/.test(window.location.search);
export class BaseTeleconferenceClient extends TypedEventBase {
    constructor(getBlob) {
        super();
        this.localUserID = null;
        this.localUserName = null;
        this.roomName = null;
        this._prepared = false;
        this._connectionState = HubConnectionState.Disconnected;
        this._conferenceState = HubConnectionState.Disconnected;
        this.hasAudioPermission = false;
        this.hasVideoPermission = false;
        this.audio = new AudioManager(isOculusQuest
            ? SpatializerType.High
            : SpatializerType.Medium, getBlob);
        this.addEventListener(CallaTeleconferenceEventType.ServerConnected, this.setConnectionState.bind(this, HubConnectionState.Connected));
        this.addEventListener(CallaTeleconferenceEventType.ServerFailed, this.setConnectionState.bind(this, HubConnectionState.Disconnected));
        this.addEventListener(CallaTeleconferenceEventType.ServerDisconnected, this.setConnectionState.bind(this, HubConnectionState.Disconnected));
        this.addEventListener(CallaTeleconferenceEventType.ConferenceJoined, this.setConferenceState.bind(this, HubConnectionState.Connected));
        this.addEventListener(CallaTeleconferenceEventType.ConferenceFailed, this.setConferenceState.bind(this, HubConnectionState.Disconnected));
        this.addEventListener(CallaTeleconferenceEventType.ConferenceRestored, this.setConferenceState.bind(this, HubConnectionState.Connected));
        this.addEventListener(CallaTeleconferenceEventType.ConferenceLeft, this.setConferenceState.bind(this, HubConnectionState.Disconnected));
    }
    toggleLogging() {
        loggingEnabled = !loggingEnabled;
    }
    get connectionState() {
        return this._connectionState;
    }
    setConnectionState(state) {
        this._connectionState = state;
    }
    get conferenceState() {
        return this._conferenceState;
    }
    setConferenceState(state) {
        this._conferenceState = state;
    }
    dispatchEvent(evt) {
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
        return super.dispatchEvent(evt);
    }
    async getNext(evtName, userID) {
        return new Promise((resolve) => {
            const getter = (evt) => {
                if (evt instanceof CallaUserEvent
                    && evt.id === userID) {
                    this.removeEventListener(evtName, getter);
                    resolve(evt);
                }
            };
            this.addEventListener(evtName, getter);
        });
    }
    get preferredAudioInputID() {
        return localStorage.getItem(PREFERRED_AUDIO_INPUT_ID_KEY);
    }
    set preferredAudioInputID(v) {
        localStorage.setItem(PREFERRED_AUDIO_INPUT_ID_KEY, v);
    }
    get preferredVideoInputID() {
        return localStorage.getItem(PREFERRED_VIDEO_INPUT_ID_KEY);
    }
    set preferredVideoInputID(v) {
        localStorage.setItem(PREFERRED_VIDEO_INPUT_ID_KEY, v);
    }
    async setPreferredDevices() {
        await this.setPreferredAudioInput(true);
        await this.setPreferredVideoInput(false);
        await this.setPreferredAudioOutput(true);
    }
    async getPreferredAudioInput(allowAny) {
        const devices = await this.getAudioInputDevices();
        const device = arrayScan(devices, (d) => d.deviceId === this.preferredAudioInputID, (d) => d.deviceId === "communications", (d) => d.deviceId === "default", (d) => allowAny && d.deviceId.length > 0);
        return device;
    }
    async setPreferredAudioInput(allowAny) {
        const device = await this.getPreferredAudioInput(allowAny);
        if (device) {
            await this.setAudioInputDevice(device);
        }
    }
    async getPreferredVideoInput(allowAny) {
        const devices = await this.getVideoInputDevices();
        const device = arrayScan(devices, (d) => d.deviceId === this.preferredVideoInputID, (d) => allowAny && d && /front/i.test(d.label), (d) => allowAny && d.deviceId.length > 0);
        return device;
    }
    async setPreferredVideoInput(allowAny) {
        const device = await this.getPreferredVideoInput(allowAny);
        if (device) {
            await this.setVideoInputDevice(device);
        }
    }
    async getDevices() {
        let devices = null;
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
                await navigator.mediaDevices.getUserMedia({ audio: !this.hasAudioPermission, video: !this.hasVideoPermission });
            }
            catch (exp) {
                console.warn(exp);
            }
        }
        return devices || [];
    }
    async getMediaPermissions() {
        await this.getDevices();
        return {
            audio: this.hasAudioPermission,
            video: this.hasVideoPermission
        };
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
    async getAudioInputDevices(filterDuplicates = false) {
        const devices = await this.getAvailableDevices(filterDuplicates);
        return devices && devices.audioInput || [];
    }
    async getVideoInputDevices(filterDuplicates = false) {
        const devices = await this.getAvailableDevices(filterDuplicates);
        return devices && devices.videoInput || [];
    }
    async setAudioOutputDevice(device) {
        if (canChangeAudioOutput) {
            this.preferredAudioOutputID = device && device.deviceId || null;
        }
    }
    async getAudioOutputDevices(filterDuplicates = false) {
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
        const curId = this.audio.getAudioOutputDeviceID(), devices = await this.getAudioOutputDevices(), device = devices.filter((d) => curId != null && d.deviceId === curId
            || curId == null && d.deviceId === this.preferredAudioOutputID);
        if (device.length === 0) {
            return null;
        }
        else {
            return device[0];
        }
    }
    get preferredAudioOutputID() {
        return localStorage.getItem(PREFERRED_AUDIO_OUTPUT_ID_KEY);
    }
    set preferredAudioOutputID(v) {
        localStorage.setItem(PREFERRED_AUDIO_OUTPUT_ID_KEY, v);
    }
    async getPreferredAudioOutput(allowAny) {
        const devices = await this.getAudioOutputDevices();
        const device = arrayScan(devices, (d) => d.deviceId === this.preferredAudioOutputID, (d) => d.deviceId === "communications", (d) => d.deviceId === "default", (d) => allowAny && d.deviceId.length > 0);
        return device;
    }
    async setPreferredAudioOutput(allowAny) {
        const device = await this.getPreferredAudioOutput(allowAny);
        if (device) {
            await this.setAudioOutputDevice(device);
        }
    }
    async setAudioInputDevice(device) {
        this.preferredAudioInputID = device && device.deviceId || null;
    }
    async setVideoInputDevice(device) {
        this.preferredVideoInputID = device && device.deviceId || null;
    }
    async connect() {
        this.setConnectionState(HubConnectionState.Connecting);
    }
    async join(_roomName, _password) {
        this.setConferenceState(HubConnectionState.Connecting);
    }
    async leave() {
        this.setConferenceState(HubConnectionState.Disconnecting);
    }
    async disconnect() {
        this.setConnectionState(HubConnectionState.Disconnecting);
    }
}
//# sourceMappingURL=BaseTeleconferenceClient.js.map