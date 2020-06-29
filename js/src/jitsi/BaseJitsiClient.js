import { id, style } from "../html/attrs.js";
import { Div } from "../html/tags.js";
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
        "localAudioMuteStatusChanged",
        "localVideoMuteStatusChanged",
        "remoteAudioMuteStatusChanged",
        "remoteVideoMuteStatusChanged",
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
    ];

// Manages communication between Jitsi Meet and Calla
export class BaseJitsiClient extends EventTarget {

    constructor() {
        super();
        /** @type {HTMLElement} */
        this.element = Div(
            id("jitsi"),
            style({
                position: "absolute",
                left: 0,
                top: 0,
                width: "100%",
                height: "100%",
                margin: 0,
                padding: 0,
                overflow: "hidden"
            }));

        /** @type {String} */
        this.localUser = null;

        this.otherUsers = new Map();

        /** @type {BaseAudioClient} */
        this.audioClient = null;

        this.preInitEvtQ = [];
    }

    hide() {
        this.element.hide();
    }

    show() {
        this.element.show();
    }

    /**
     * 
     * @param {number} top
     */
    resize(top) {
        if (top !== undefined) {
            this.element.style.top = top + "px";
            this.element.style.height = `calc(100% - ${top}px)`;
        }
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

        this.addEventListener("participantJoined", (evt) => {
            this.otherUsers.set(evt.id, evt.displayName);
        });

        this.addEventListener("participantLeft", (evt) => {
            if (this.otherUsers.has(evt.id)) {
                this.otherUsers.delete(evt.id);
            }
        });

        this.addEventListener("displayNameChange", (evt) => {
            this.otherUsers.set(evt.id, evt.displayname);
        });

        const localizeMuteEvent = (type) => (evt) => {
            const isLocal = evt.id === this.localUser
                || evt.id === null
                || evt.id === undefined,
                evt2 = Object.assign(
                    new Event((isLocal ? "local" : "remote") + type + "MuteStatusChanged"),
                    {
                        id: isLocal ? this.localUser : evt.id,
                        muted: evt.muted
                    });
            this.dispatchEvent(evt2);
        };

        this.addEventListener("audioMuteStatusChanged", localizeMuteEvent("Audio"));
        this.addEventListener("videoMuteStatusChanged", localizeMuteEvent("Video"));

        this.addEventListener("localAudioMuteStatusChanged", (evt) => {
            this.audioMuteStatusChanged(evt.muted);
        });

        this.addEventListener("localVideoMuteStatusChanged", (evt) => {
            this.videoMuteStatusChanged(evt.muted);
        });

        window.addEventListener("unload", () => {
            this.dispose();
        });

        this.setDisplayName(userName);

        return await joinTask;
    }

    dispose() {
    }

    /**
     * 
     * @param {string} userName
     */
    setDisplayName(userName) {
        throw new Error("Not implemented in base class");
    }

    async leaveAsync() {
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
        for (let toUserID of this.otherUsers.keys()) {
            this.sendMessageTo(toUserID, "userMoved", evt);
        }
    }

    setUserPosition(evt) {
        this.audioClient.setUserPosition(evt);
    }

    removeUser(evt) {
        this.audioClient.removeUser(evt);
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
        for (let toUserID of this.otherUsers.keys()) {
            this.sendMessageTo(toUserID, "setAvatarEmoji", emoji);
        }
    }

    emote(emoji) {
        for (let toUserID of this.otherUsers.keys()) {
            this.sendMessageTo(toUserID, "emote", emoji);
        }
    }

    /**
     *
     * @param {boolean} muted
     */
    audioMuteStatusChanged(muted) {
        const evt = { muted };
        for (let toUserID of this.otherUsers.keys()) {
            this.sendMessageTo(toUserID, "audioMuteStatusChanged", evt);
        }
    }

    /**
     * 
     * @param {boolean} muted
     */
    videoMuteStatusChanged(muted) {
        const evt = { muted };
        for (let toUserID of this.otherUsers.keys()) {
            this.sendMessageTo(toUserID, "videoMuteStatusChanged", evt);
        }
    }
}

class JitsiClientEvent extends Event {
    constructor(command, id, value) {
        super(command);
        this.id = id;
        Event.clone(this, value);
    }
}