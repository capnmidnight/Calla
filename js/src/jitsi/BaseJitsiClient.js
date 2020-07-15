import { BaseAudioClient } from "../audio/BaseAudioClient.js";
import { canChangeAudioOutput } from "../audio/canChangeAudioOutput.js";
import { arrayClear, arrayScan } from "../protos/Array.js";

// helps us filter out data channel messages that don't belong to us
const APP_FINGERPRINT
    = window.APP_FINGERPRINT
    = "Calla",
    eventNames = [
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

        /** @type {String} */
        this.localUser = null;

        /** @type {BaseAudioClient} */
        this.audioClient = null;

        this.preInitEvtQ = [];

        this.preferedAudioOutputID = null;
        this.preferedAudioInputID = null;
        this.preferedVideoInputID = null;
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
     * 
     * @param {string} host
     * @param {string} roomName
     * @param {string} userName
     */
    async initializeAsync(host, roomName, userName) {
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
     * 
     * @param {string} host
     * @param {string} roomName
     * @param {string} userName
     */
    async joinAsync(host, roomName, userName) {
        this.dispose();

        const joinTask = this.once("videoConferenceJoined");

        await this.initializeAsync(host, roomName, userName);

        window.addEventListener("unload", () => {
            this.dispose();
        });

        const joinInfo = await joinTask;

        this.setDisplayName(userName);

        if (canChangeAudioOutput) {
            const audioOutputs = await this.getAudioOutputDevicesAsync();
            const audOut = arrayScan(
                audioOutputs,
                (d) => d.deviceId === this.preferedAudioOutputID,
                (d) => d.deviceId === "communications",
                (d) => d.deviceId === "default",
                (d) => !!d);
            if (audOut) {
                await this.setAudioOutputDeviceAsync(audOut);
            }
        }

        const audioInputs = await this.getAudioInputDevicesAsync();
        const audIn = arrayScan(
            audioInputs,
            (d) => d.deviceId === this.preferedAudioInputID,
            (d) => d.deviceId === "communications",
            (d) => d.deviceId === "default",
            (d) => !!d);
        if (audIn) {
            await this.setAudioInputDeviceAsync(audIn);
        }

        const videoInputs = await this.getVideoInputDevicesAsync();
        const vidIn = arrayScan(
            videoInputs,
            (d) => d.deviceId === this.preferedVideoInputID);
        if (vidIn) {
            await this.setVideoInputDeviceAsync(vidIn);
        }

        return joinInfo;
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


    async getAudioOutputDevicesAsync() {
        throw new Error("Not implemented in base class");
    }

    /**
     * @return {Promise.<MediaDeviceInfo>} */
    async getCurrentAudioOutputDeviceAsync() {
        throw new Error("Not implemented in base class");
    }

    /**
     * 
     * @param {MediaDeviceInfo} device
     */
    async setAudioOutputDeviceAsync(device) {
        throw new Error("Not implemented in base class");
    }

    async getAudioInputDevicesAsync() {
        throw new Error("Not implemented in base class");
    }

    async getCurrentAudioInputDeviceAsync() {
        throw new Error("Not implemented in base class");
    }

    async setAudioInputDeviceAsync(device) {
        throw new Error("Not implemented in base class");
    }

    async getVideoInputDevicesAsync() {
        throw new Error("Not implemented in base class");
    }

    async getCurrentVideoInputDeviceAsync() {
        throw new Error("Not implemented in base class");
    }

    async setVideoInputDeviceAsync(device) {
        throw new Error("Not implemented in base class");
    }

    async toggleAudioMutedAsync() {
        throw new Error("Not implemented in base class");
    }

    async toggleVideoMutedAsync() {
        throw new Error("Not implemented in base class");
    }

    setAvatarURL(url) {
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
            hax: APP_FINGERPRINT,
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

    setAvatarEmoji(emoji) {
        for (let toUserID of this.userIDs()) {
            this.sendMessageTo(toUserID, "setAvatarEmoji", emoji);
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
                && !Event.prototype.hasOwnProperty(key)) {
                this[key] = value[key];
            }
        }
    }
}