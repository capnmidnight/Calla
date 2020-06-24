import { CallaUserEvent } from "../events.js";
import { id } from "../html/attrs.js";
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
        "audioActivity"
    ];

// Manages communication between Jitsi Meet and Calla
export class BaseJitsiClient extends EventTarget {

    constructor() {
        super();
        this.element = Div(id("jitsi"));
        this.localUser = null;
        this.otherUsers = new Map();
    }

    async initializeAsync(host, roomName) {
        throw new Error("Not implemented in base class.");
    }

    async joinAsync(roomName, userName) {
        this.dispose();
        await this.initializeAsync(JITSI_HOST, roomName);

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

        this.addEventListener("audioMuteStatusChanged", (evt) => {
            if (evt.id === this.localUser) {
                this.audioMuteStatusChanged(evt.muted);
            }
        });

        this.addEventListener("videoMuteStatusChanged", (evt) => {
            if (evt.id === this.localUser) {
                this.videoMuteStatusChanged(evt.muted);
            }
        });

        const localizeMuteEvent = (type) => (evt) => {
            const evt2 = Object.assign(
                new Event((evt.id === this.localUser ? "local" : "remote") + type + "MuteStatusChanged"), {
                id: evt.id,
                muted: evt.muted
            });
            this.dispatchEvent(evt2);
        };

        this.addEventListener("audioMuteStatusChanged", localizeMuteEvent("Audio"));
        this.addEventListener("videoMuteStatusChanged", localizeMuteEvent("Video"));

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
        throw new Error("Not implemented in base class.");
    }

    setPosition(evt) {
        throw new Error("Not implemented in base class.");
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
        this.txGameData(toUserID, "userInitResponse", fromUserState);
    }

    emote(emoji) {
        for (let toUserID of this.otherUsers.keys()) {
            this.txGameData(toUserID, "emote", emoji);
        }
    }

    audioMuteStatusChanged(muted) {
        for (let toUserID of this.otherUsers.keys()) {
            this.txGameData(toUserID, "audioMuteStatusChanged", { muted });
        }
    }

    videoMuteStatusChanged(muted) {
        for (let toUserID of this.otherUsers.keys()) {
            this.txGameData(toUserID, "videoMuteStatusChanged", { muted });
        }
    }
}