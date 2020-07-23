import { BaseAudioClient } from "../audio/BaseAudioClient.js";
import { canChangeAudioOutput } from "../audio/canChangeAudioOutput.js";
import { arrayClear, arrayScan } from "../protos/Array.js";

// helps us filter out data channel messages that don't belong to us
const eventNames = [
    "userMoved",
    "emote",
    "userInitRequest",
    "userInitResponse",
    "audioMuteStatusChanged",
    "videoMuteStatusChanged",
    "videoConferenceJoined",
    "videoConferenceLeft",
    "participantJoined",
    "participantLeft",
    "avatarChanged",
    "displayNameChange",
    "audioActivity",
    "setAvatarEmoji",
    "deviceListChanged",
    "participantRoleChanged",
    "audioAdded",
    "videoAdded",
    "audioRemoved",
    "videoRemoved"
];

// Manages communication between Jitsi Meet and Calla
export class BaseJitsiClient extends EventTarget {

    constructor() {
        super();

        this.hasAudioPermission = false;
        this.hasVideoPermission = false;

        /** @type {String} */
        this.localUser = null;

        /** @type {BaseAudioClient} */
        this.audioClient = null;

        this.preInitEvtQ = [];

        this.preferredAudioOutputID = null;
        this.preferredAudioInputID = null;
        this.preferredVideoInputID = null;
    }

    get appFingerPrint() {
        return "Calla";
    }

    userIDs() {
        throw new Error("Not implemented in base class");
    }

    userExists(id) {
        throw new Error("Not implemented in base class");
    }

    users() {
        throw new Error("Not implemented in base class");
    }


    /**
     * @param {string} roomName
     * @param {string} userName
     */
    async initializeAsync(roomName, userName) {
        throw new Error("Not implemented in base class.");
    }

    dispatchEvent(evt) {
        if (this.localUser !== null) {
            if (evt.id === null
                || evt.id === undefined
                || evt.id === "local") {
                evt.id = this.localUser;
            }

            super.dispatchEvent(evt);
            if (evt.type === "videoConferenceLeft") {
                this.localUser = null;
            }
        }
        else if (evt.type === "videoConferenceJoined") {
            this.localUser = evt.id;

            this.dispatchEvent(evt);
            for (evt of this.preInitEvtQ) {
                this.dispatchEvent(evt);
            }

            arrayClear(this.preInitEvtQ);
        }
        else {
            this.preInitEvtQ.push(evt);
        }
    }

    /**
     * @param {string} roomName
     * @param {string} userName
     */
    async joinAsync(roomName, userName) {
        this.dispose();

        const joinTask = this.once("videoConferenceJoined");

        await this.initializeAsync(roomName, userName);

        window.addEventListeners({
            beforeunload: () => this.dispose(),
            pagehide: () => this.dispose()
        });

        const joinInfo = await joinTask;

        this.setDisplayName(userName);

        await this.setPreferredDevicesAsync();

        return joinInfo;
    }

    async setPreferredDevicesAsync() {
        await this.setPreferredAudioOutputAsync(true);
        await this.setPreferredAudioInputAsync(true);
        await this.setPreferredVideoInputAsync(false);
    }

    async setPreferredAudioOutputAsync(allowAny) {
        const devices = await this.getAudioOutputDevicesAsync();
        const device = arrayScan(devices,
            (d) => d.deviceId === this.preferredAudioOutputID,
            (d) => d.deviceId === "communications",
            (d) => d.deviceId === "default",
            (d) => allowAny && d && d.deviceId);
        if (device) {
            await this.setAudioOutputDeviceAsync(device);
        }
    }

    async setPreferredAudioInputAsync(allowAny) {
        const devices = await this.getAudioInputDevicesAsync();
        const device = arrayScan(devices,
            (d) => d.deviceId === this.preferredAudioInputID,
            (d) => d.deviceId === "communications",
            (d) => d.deviceId === "default",
            (d) => allowAny && d && d.deviceId);
        if (device) {
            this.preferredAudioInputID = device.deviceId;
            await this.setAudioInputDeviceAsync(device);
        }
    }

    async setPreferredVideoInputAsync(allowAny) {
        const devices = await this.getVideoInputDevicesAsync();
        const device = arrayScan(devices,
            (d) => d.deviceId === this.preferredVideoInputID,
            (d) => allowAny && d && /front/i.test(d.label),
            (d) => allowAny && d && d.deviceId);
        if (device) {
            this.preferredVideoInputID = device.deviceId;
            await this.setVideoInputDeviceAsync(device);
        }
    }

    dispose() {
        this.leave();
    }

    /**
     * 
     * @param {string} userName
     */
    setDisplayName(userName) {
        throw new Error("Not implemented in base class");
    }

    async leaveAsync() {
        const leaveTask = this.once("videoConferenceLeft", 5000);
        const maybeLeaveTask = this.leave();
        if (maybeLeaveTask instanceof Promise) {
            await maybeLeaveTask;
        }
        return await leaveTask;
    }

    leave() {
        throw new Error("Not implemented in base class");
    }

    async _getDevicesAsync() {
        let devices = await navigator.mediaDevices.enumerateDevices();

        for (let device of devices) {
            if (device.deviceId.length > 0) {
                this.hasAudioPermission |= device.kind === "audioinput";
                this.hasVideoPermission |= device.kind === "videoinput";
            }
        }

        return devices;
    }

    async getAvailableDevicesAsync() {
        let devices = await this._getDevicesAsync();

        for (let i = 0; i < 3 && !this.hasAudioPermission; ++i) {
            devices = null;
            try {
                const _ = await navigator.mediaDevices.getUserMedia({ audio: !this.hasAudioPermission, video: !this.hasVideoPermission });
            }
            catch (exp) {
                console.warn(exp);
            }

            devices = await this._getDevicesAsync();
        }

        return {
            audioOutput: canChangeAudioOutput ? devices.filter(d => d.kind === "audiooutput") : [],
            audioInput: devices.filter(d => d.kind === "audioinput"),
            videoInput: devices.filter(d => d.kind === "videoinput")
        };
    }

    async getAudioOutputDevicesAsync() {
        if (!canChangeAudioOutput) {
            return [];
        }
        const devices = await this.getAvailableDevicesAsync();
        return devices && devices.audioOutput || [];
    }

    async getAudioInputDevicesAsync() {
        const devices = await this.getAvailableDevicesAsync();
        return devices && devices.audioInput || [];
    }

    async getVideoInputDevicesAsync() {
        const devices = await this.getAvailableDevicesAsync();
        return devices && devices.videoInput || [];
    }

    /**
     * 
     * @param {MediaDeviceInfo} device
     */
    async setAudioOutputDeviceAsync(device) {
        this.preferredAudioOutputID = device && device.deviceId || null;
    }

    /**
     *
     * @param {MediaDeviceInfo} device
     */
    async setAudioInputDeviceAsync(device) {
        this.preferredAudioInputID = device && device.deviceId || null;
    }

    /**
     *
     * @param {MediaDeviceInfo} device
     */
    async setVideoInputDeviceAsync(device) {
        this.preferredVideoInputID = device && device.deviceId || null;
    }

    async getCurrentAudioInputDeviceAsync() {
        throw new Error("Not implemented in base class");
    }

    /**
     * @return {Promise.<MediaDeviceInfo>} */
    async getCurrentAudioOutputDeviceAsync() {
        throw new Error("Not implemented in base class");
    }

    async getCurrentVideoInputDeviceAsync() {
        throw new Error("Not implemented in base class");
    }

    async toggleAudioMutedAsync() {
        throw new Error("Not implemented in base class");
    }

    async toggleVideoMutedAsync() {
        throw new Error("Not implemented in base class");
    }

    /**
     * @return {Promise.<boolean>}
     */
    get isAudioMuted() {
        throw new Error("Not implemented in base class");
    }

    /**
     * @return {Promise.<boolean>}
     */
    get isVideoMuted() {
        throw new Error("Not implemented in base class");
    }

    txGameData(toUserID, data) {
        throw new Error("Not implemented in base class");
    }

    rxGameData(evt) {
        throw new Error("Not implemented in base class");
    }

    /// Send a Calla message through the Jitsi Meet data channel.
    sendMessageTo(toUserID, command, value) {
        this.txGameData(toUserID, {
            hax: this.appFingerPrint,
            command,
            value
        });
    }

    receiveMessageFrom(fromUserID, command, value) {
        const evt = new JitsiClientEvent(command, fromUserID, value);
        this.dispatchEvent(evt);
    }

    /**
     * Sets parameters that alter spatialization.
     * @param {number} minDistance
     * @param {number} maxDistance
     * @param {number} rolloff
     * @param {number} transitionTime
     */
    setAudioProperties(minDistance, maxDistance, rolloff, transitionTime) {
        this.audioClient.setAudioProperties(minDistance, maxDistance, rolloff, transitionTime);
    }

    /**
     * Set the position of the listener.
     * @param {number} x - the horizontal component of the position.
     * @param {number} y - the vertical component of the position.
     */
    setLocalPosition(x, y) {
        this.audioClient.setLocalPosition(x, y);
        for (let toUserID of this.userIDs()) {
            this.sendMessageTo(toUserID, "userMoved", { x, y });
        }
    }

    /**
     * Set the position of an audio source.
     * @param {string} id - the id of the user for which to set the position.
     * @param {number} x - the horizontal component of the position.
     * @param {number} y - the vertical component of the position.
     */
    setUserPosition(id, x, y) {
        this.audioClient.setUserPosition(id, x, y);
    }

    removeUser(evt) {
        this.audioClient.removeSource(evt.id);
    }

    /**
     *
     * @param {boolean} muted
     */
    async setAudioMutedAsync(muted) {
        let isMuted = this.isAudioMuted;
        if (muted !== isMuted) {
            isMuted = await this.toggleAudioMutedAsync();
        }
        return isMuted;
    }

    /**
     *
     * @param {boolean} muted
     */
    async setVideoMutedAsync(muted) {
        let isMuted = this.isVideoMuted;
        if (muted !== isMuted) {
            isMuted = await this.toggleVideoMutedAsync();
        }
        return isMuted;
    }

    /// Add a listener for Calla events that come through the Jitsi Meet data channel.
    /**
     * 
     * @param {string} evtName
     * @param {function} callback
     * @param {AddEventListenerOptions} opts
     */
    addEventListener(evtName, callback, opts) {
        if (eventNames.indexOf(evtName) === -1) {
            throw new Error(`Unsupported event type: ${evtName}`);
        }

        super.addEventListener(evtName, callback, opts);
    }

    /**
     * 
     * @param {string} toUserID
     */
    userInitRequest(toUserID) {
        this.sendMessageTo(toUserID, "userInitRequest");
    }

    /**
     * 
     * @param {string} toUserID
     */
    async userInitRequestAsync(toUserID) {
        return await this.until("userInitResponse",
            () => this.userInitRequest(toUserID),
            (evt) => evt.id === toUserID,
            1000);
    }

    /**
     * 
     * @param {string} toUserID
     * @param {User} fromUserState
     */
    userInitResponse(toUserID, fromUserState) {
        this.sendMessageTo(toUserID, "userInitResponse", fromUserState);
    }

    set avatarEmoji(emoji) {
        for (let toUserID of this.userIDs()) {
            this.sendMessageTo(toUserID, "setAvatarEmoji", emoji);
        }
    }

    set avatarURL(url) {
        for (let toUserID of this.userIDs()) {
            this.sendMessageTo(toUserID, "avatarChanged", { url });
        }
    }

    emote(emoji) {
        for (let toUserID of this.userIDs()) {
            this.sendMessageTo(toUserID, "emote", emoji);
        }
    }

    startAudio() {
    }
}

class JitsiClientEvent extends Event {
    constructor(command, id, value) {
        super(command);
        this.id = id;
        for (let key in value) {
            if (key !== "isTrusted"
                && !Object.prototype.hasOwnProperty.call(Event.prototype, key)) {
                this[key] = value[key];
            }
        }
    }
}