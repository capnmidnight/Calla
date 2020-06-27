import { CallaUserEvent, copy } from "../events.js";
import { id, style } from "../html/attrs.js";
import { Div } from "../html/tags.js";

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
        "setAvatarEmoji"
    ],
    evtMuted = Object.seal({
        id: null,
        muted: null
    }),
    evtEmoji = Object.seal({
        id: null,
        value: null,
        desc: null
    }),
    evtUserState = Object.seal({
        id: null,
        x: null,
        y: null,
        displayName: null,
        avatarURL: null,
        avatarEmoji: null
    }),
    evtAudioProperties = Object.seal({
        origin: null,
        transitionTime: null,
        minDistance: null,
        maxDistance: null,
        rolloff: null
    });

// Manages communication between Jitsi Meet and Calla
export class BaseJitsiClient extends EventTarget {

    constructor() {
        super();
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
        this.localUser = null;
        this.otherUsers = new Map();
        this.audioClient = null;
        this.preInitEvtQ = [];
    }

    hide() {
        this.element.hide();
    }

    show() {
        this.element.show();
    }

    resize(top) {
        if (top !== undefined) {
            this.element.style.top = top + "px";
            this.element.style.height = `calc(100% - ${top}px)`;
        }
    }

    async initializeAsync(host, roomName) {
        throw new Error("Not implemented in base class.");
    }

    dispatchEvent(evt) {
        if (evt.type === "videoConferenceJoined") {
            super.dispatchEvent(evt);
            for (evt of this.preInitEvtQ) {
                if (evt.hasOwnProperty("id")
                    && evt.id === null) {
                    evt.id = this.localUser;
                }

                super.dispatchEvent(evt);
            }
            this.preInitEvtQ.splice(1);
        }
        else if (this.localUser === null) {
            this.preInitEvtQ.push(evt);
        }
        else {
            super.dispatchEvent(evt);
        }
    }

    async joinAsync(host, roomName, userName) {
        this.dispose();
        await this.initializeAsync(host, roomName);

        this.addEventListener("videoConferenceJoined", (evt) => {
            this.localUser = evt.id;
        });

        this.addEventListener("videoConferenceLeft", (evt) => {
            this.localUser = null;
        });

        this.addEventListener("participantJoined", (evt) => {
            this.otherUsers.set(evt.id, evt.displayName);
        });

        this.addEventListener("participantLeft", (evt) => {
            if (this.otherUsers.has(evt.id)) {
                this.otherUsers.delete(evt.id);
            }
        });

        this.addEventListener("displayNameChange", (evt) => {
            if (this.otherUsers.has(evt.id)) {
                this.otherUsers.set(evt.id, evt.displayname);
            }
        });

        const localizeMuteEvent = (type) => (evt) => {
            const isLocal = evt.id === this.localUser
                || evt.id === null
                || evt.id === undefined,
                evt2 = Object.assign(
                    new Event((isLocal ? "local" : "remote") + type + "MuteStatusChanged"), {
                    id: this.localUser,
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
    }

    dispose() {
    }

    setDisplayName(userName) {
        throw new Error("Not implemented in base class");
    }

    leave() {
        throw new Error("Not implemented in base class");
    }

    async getAudioOutputDevices() {
        throw new Error("Not implemented in base class");
    }

    async getCurrentAudioOutputDevice() {
        throw new Error("Not implemented in base class");
    }

    setAudioOutputDevice(device) {
        throw new Error("Not implemented in base class");
    }

    async getAudioInputDevices() {
        throw new Error("Not implemented in base class");
    }

    async getCurrentAudioInputDevice() {
        throw new Error("Not implemented in base class");
    }

    setAudioInputDevice(device) {
        throw new Error("Not implemented in base class");
    }

    async getVideoInputDevices() {
        throw new Error("Not implemented in base class");
    }

    async getCurrentVideoInputDevice() {
        throw new Error("Not implemented in base class");
    }

    setVideoInputDevice(device) {
        throw new Error("Not implemented in base class");
    }

    toggleAudio() {
        throw new Error("Not implemented in base class");
    }

    toggleVideo() {
        throw new Error("Not implemented in base class");
    }

    setAvatarURL(url) {
        throw new Error("Not implemented in base class");
    }

    async isAudioMutedAsync() {
        throw new Error("Not implemented in base class");
    }

    async isVideoMutedAsync() {
        throw new Error("Not implemented in base class");
    }

    sendMessageTo(toUserID, data) {
        throw new Error("Not implemented in base class");
    }

    setAudioProperties(origin, transitionTime, minDistance, maxDistance, rolloff) {
        evtAudioProperties.origin = origin;
        evtAudioProperties.transitionTime = transitionTime;
        evtAudioProperties.minDistance = minDistance;
        evtAudioProperties.maxDistance = maxDistance;
        evtAudioProperties.rolloff = rolloff;

        this.audioClient.setAudioProperties(evtAudioProperties);
    }

    setPosition(evt) {
        if (evt.id === this.localUser) {
            this.audioClient.setLocalPosition(evt);
            for (let toUserID of this.otherUsers.keys()) {
                this.txGameData(toUserID, "userMoved", evt);
            }
        }
        else {
            this.audioClient.setUserPosition(evt);
        }
    }

    removeUser(evt) {
        this.audioClient.removeUser(evt);
    }

    async setAudioMutedAsync(muted) {
        const isMuted = await this.isAudioMutedAsync();
        if (muted !== isMuted) {
            this.toggleAudio();
        }
    }

    async setVideoMutedAsync(muted) {
        const isMuted = await this.isVideoMutedAsync();
        if (muted !== isMuted) {
            this.toggleVideo();
        }
    }

    /// Add a listener for Calla events that come through the Jitsi Meet data channel.
    addEventListener(evtName, callback, opts) {
        if (eventNames.indexOf(evtName) === -1) {
            throw new Error(`Unsupported event type: ${evtName}`);
        }

        super.addEventListener(evtName, callback, opts);
    }

    /// Send a Calla message through the Jitsi Meet data channel.
    txGameData(id, command, value) {
        const data = {
            hax: APP_FINGERPRINT,
            command,
            value
        };
        this.sendMessageTo(id, data);
    }

    /// A listener to add to JitsiExternalAPI::endpointTextMessageReceived event
    /// to receive Calla messages from the Jitsi Meet data channel.
    rxGameData(evt) {
        // JitsiExternalAPI::endpointTextMessageReceived event arguments format: 
        // evt = {
        //    data: {
        //      senderInfo: {
        //        jid: "string", // the jid of the sender
        //        id: "string" // the participant id of the sender
        //      },
        //      eventData: {
        //        name: "string", // the name of the datachannel event: `endpoint-text-message`
        //        text: "string" // the received text from the sender
        //      }
        //   }
        //};
        const data = JSON.parse(evt.data.eventData.text);
        if (data.hax === APP_FINGERPRINT) {
            const evt2 = new CallaUserEvent(evt.data.senderInfo.id, data);
            this.dispatchEvent(evt2);
        }
    }

    userInitRequest(toUserID) {
        this.txGameData(toUserID, "userInitRequest");
    }

    userInitRequestAsync(toUserID) {
        return this.until("userInitResponse",
            () => this.userInitRequest(toUserID),
            (evt) => evt.id === toUserID,
            1000);
    }

    userInitResponse(toUserID, fromUserState) {
        this.txGameData(toUserID, "userInitResponse", copy(evtUserState, fromUserState));
    }

    setAvatarEmoji(emoji) {
        copy(evtEmoji, emoji);
        for (let toUserID of this.otherUsers.keys()) {
            this.txGameData(toUserID, "setAvatarEmoji", evtEmoji);
        }
    }

    emote(emoji) {
        copy(evtEmoji, emoji);
        for (let toUserID of this.otherUsers.keys()) {
            this.txGameData(toUserID, "emote", evtEmoji);
        }
    }

    audioMuteStatusChanged(muted) {
        evtMuted.id = this.localUser;
        evtMuted.muted = muted;
        for (let toUserID of this.otherUsers.keys()) {
            this.txGameData(toUserID, "audioMuteStatusChanged", evtMuted);
        }
    }

    videoMuteStatusChanged(muted) {
        evtMuted.id = this.localUser;
        evtMuted.muted = muted;
        for (let toUserID of this.otherUsers.keys()) {
            this.txGameData(toUserID, "videoMuteStatusChanged", evtMuted);
        }
    }
}