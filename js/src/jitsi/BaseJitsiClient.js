import { BaseAudioClient } from "../audio/BaseAudioClient.js";

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

            this.preInitEvtQ.clear();
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


        const audioOutputs = await this.getAudioOutputDevicesAsync();
        const output = audioOutputs.scan(
            (d) => d.deviceId === "communications",
            (d) => d.deviceId === "default");

        if (output) {
            await this.setAudioOutputDevice(output);
        }

        const audioInputs = await this.getAudioInputDevicesAsync();
        const input = audioInputs.scan(
            (d) => d.deviceId === "communications",
            (d) => d.deviceId === "default");

        if (input) {
            await this.setAudioInputDeviceAsync(input);
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
    setAudioOutputDevice(device) {
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

    async toggleAudioAsync() {
        throw new Error("Not implemented in base class");
    }

    async toggleVideoAsync() {
        throw new Error("Not implemented in base class");
    }

    setAvatarURL(url) {
        throw new Error("Not implemented in base class");
    }

    /**
     * @return {Promise.<boolean>}
     */
    async isAudioMutedAsync() {
        throw new Error("Not implemented in base class");
    }

    /**
     * @return {Promise.<boolean>}
     */
    async isVideoMutedAsync() {
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

    setAudioProperties(origin, transitionTime, minDistance, maxDistance, rolloff) {
        const evt = {
            origin,
            transitionTime,
            minDistance,
            maxDistance,
            rolloff
        };
        this.audioClient.setAudioProperties(evt);
    }

    setLocalPosition(evt) {
        this.audioClient.setLocalPosition(evt);
        for (let toUserID of this.userIDs()) {
            this.sendMessageTo(toUserID, "userMoved", evt);
        }
    }

    setUserPosition(evt) {
        this.audioClient.setUserPosition(evt);
    }

    removeUser(evt) {
        this.audioClient.removeSource(evt.id);
    }

    /**
     *
     * @param {boolean} muted
     */
    async setAudioMutedAsync(muted) {
        let isMuted = await this.isAudioMutedAsync();
        if (muted !== isMuted) {
            isMuted = await this.toggleAudioAsync();
        }
        return isMuted;
    }

    /**
     *
     * @param {boolean} muted
     */
    async setVideoMutedAsync(muted) {
        let isMuted = await this.isVideoMutedAsync();
        if (muted !== isMuted) {
            isMuted = await this.toggleVideoAsync();
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
        Event.clone(this, value);
    }
}