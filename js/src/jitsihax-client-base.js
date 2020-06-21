import { Div } from "./html/tags.js";
import { id } from "./html/attrs.js";

// helps us filter out data channel messages that don't belong to us
const APP_FINGERPRINT = "Calla",
    eventNames = [
        "moveTo",
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
        "audioActivity"
    ];

// Manages communication between Jitsi Meet and Calla
export class BaseJitsiClient extends EventTarget {

    constructor() {
        super();
        this.element = Div(id("jitsi"));
        this.api = null;
        this.iframe = null;
        this.apiOrigin = null;
        this.apiWindow = null;
        addEventListener("message", this.rxJitsiHax.bind(this));
    }

    async getApiClassAsync() {
        throw new Error("Not implemented in base class.");
    }

    async joinAsync(roomName, userName) {
        const ApiClass = await this.getApiClassAsync();
        await new Promise((resolve, reject) => {
            this.api = new ApiClass(JITSI_HOST, {
                parentNode: this.element,
                roomName,
                onload: () => {
                    this.iframe = this.api.getIFrame();
                    this.apiOrigin = new URL(this.iframe.src).origin;
                    this.apiWindow = this.iframe.contentWindow || window;
                    resolve();
                },
                noSSL: false,
                width: "100%",
                height: "100%",
                configOverwrite: {
                    startVideoMuted: 0,
                    startWithVideoMuted: true
                },
                interfaceConfigOverwrite: {
                    DISABLE_VIDEO_BACKGROUND: true,
                    SHOW_JITSI_WATERMARK: false,
                    SHOW_WATERMARK_FOR_GUESTS: false,
                    SHOW_POWERED_BY: true,
                    AUTHENTICATION_ENABLE: false,
                    MOBILE_APP_PROMO: false
                }
            });

            const reroute = (evtType, copy) => {
                this.api.addEventListener(evtType, (rootEvt) => {
                    const evt = Object.assign(
                        new Event(evtType),
                        copy(rootEvt));
                    this.dispatchEvent(evt);
                });
            };

            reroute("videoConferenceJoined", (evt) => {
                return {
                    roomName: evt.roomName,
                    id: evt.id,
                    displayName: evt.displayName
                };
            });

            reroute("videoConferenceLeft", (evt) => {
                return {
                    roomName: evt.roomName
                };
            });

            reroute("participantJoined", (evt) => {
                return {
                    id: evt.id,
                    displayName: evt.displayName
                };
            });

            reroute("participantLeft", (evt) => {
                return {
                    id: evt.id
                };
            });

            reroute("avatarChanged", (evt) => {
                return {
                    id: evt.id,
                    avatarURL: evt.avatarURL
                };
            });

            reroute("displayNameChange", (evt) => {
                return {
                    id: evt.id,

                    // The External API misnames this
                    displayName: evt.displayname
                };
            });

            reroute("audioMuteStatusChanged", (evt) => {
                return {
                    muted: evt.muted
                };
            });

            reroute("videoMuteStatusChanged", (evt) => {
                return {
                    muted: evt.muted
                };
            });

            this.api.addEventListener("endpointTextMessageReceived",
                this.rxGameData.bind(this));

            addEventListener("unload", () =>
                this.api.dispose());

            this.api.executeCommand("displayName", userName);
        });
    }

    leave() {
        this.api.executeCommand("hangup");
    }

    async getAudioOutputDevices() {
        const devices = await this.api.getAvailableDevices();
        return devices && devices.audioOutput || [];
    }

    async getCurrentAudioOutputDevice() {
        const devices = await this.api.getCurrentDevices();
        return devices && devices.audioOutput || null;
    }

    setAudioOutputDevice(device) {
        this.api.setAudioOutputDevice(device.label, device.id);
    }

    async getAudioInputDevices() {
        const devices = await this.api.getAvailableDevices();
        return devices && devices.audioInput || [];
    }

    async getCurrentAudioInputDevice() {
        const devices = await this.api.getCurrentDevices();
        return devices && devices.audioInput || null;
    }

    setAudioInputDevice(device) {
        this.api.setAudioInputDevice(device.label, device.id);
    }

    async getVideoInputDevices() {
        const devices = await this.api.getAvailableDevices();
        return devices && devices.videoInput || [];
    }

    async getCurrentVideoInputDevice() {
        const devices = await this.api.getCurrentDevices();
        return devices && devices.videoInput || null;
    }

    setVideoInputDevice(device) {
        this.api.setVideoInputDevice(device.label, device.id);
    }

    toggleAudio() {
        this.api.executeCommand("toggleAudio");
    }

    toggleVideo() {
        this.api.executeCommand("toggleVideo");
    }

    setAvatarURL(url) {
        this.api.executeCommand("avatarUrl", url);
    }

    async isAudioMutedAsync() {
        return await this.api.isAudioMuted();
    }

    async setAudioMutedAsync(muted) {
        const isMuted = await this.isAudioMutedAsync();
        if (muted !== isMuted) {
            this.toggleAudio();
        }
    }

    async isVideoMutedAsync() {
        return await this.api.isVideoMuted();
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
    txGameData(id, command, obj) {
        obj = obj || {};
        obj.hax = APP_FINGERPRINT;
        obj.command = command;
        this.api.executeCommand("sendEndpointTextMessage", id, JSON.stringify(obj));
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
            const evt2 = new JitsiClientEvent(evt.data.senderInfo.id, data);
            this.dispatchEvent(evt2);
        }
    }

    userInitRequest(toUserID) {
        this.txGameData(toUserID, "userInitRequest");
    }

    userInitRequestAsync(toUserID) {
        return this.until("userInitResponse",
            () => this.userInitRequest(toUserID),
            (evt) => evt.participantID === toUserID,
            1000);
    }

    userInitResponse(toUserID, fromUser) {
        this.txGameData(toUserID, "userInitResponse", fromUser);
    }

    emote(toUserID, emoji) {
        this.txGameData(toUserID, "emote", emoji);
    }

    audioMuteStatusChanged(toUserID, muted) {
        this.txGameData(toUserID, "audioMuteStatusChanged", { muted });
    }

    videoMuteStatusChanged(toUserID, muted) {
        this.txGameData(toUserID, "videoMuteStatusChanged", { muted });
    }

    moveTo(toUserID, evt) {
        this.txGameData(toUserID, "moveTo", evt);
    }

    /// Send a Calla message to the jitsihax.js script
    txJitsiHax(command, obj) {
        if (this.apiWindow) {
            obj.hax = APP_FINGERPRINT;
            obj.command = command;
            this.apiWindow.postMessage(JSON.stringify(obj), this.apiOrigin);
        }
    }

    rxJitsiHax(evt) {
        const isLocalHost = evt.origin.match(/^https?:\/\/localhost\b/);
        if (evt.origin === "https://" + JITSI_HOST || isLocalHost) {
            try {
                const data = JSON.parse(evt.data);
                if (data.hax === APP_FINGERPRINT) {
                    const evt2 = new CallaEvent(data);
                    this.dispatchEvent(evt2);
                }
            }
            catch (exp) {
                console.error(exp);
            }
        }
    }

    setAudioProperties(origin, transitionTime, minDistance, maxDistance, rolloff) {
        this.txJitsiHax("setAudioProperties", {
            origin,
            transitionTime,
            minDistance,
            maxDistance,
            rolloff
        });
    }

    setUserPosition(evt) {
        this.txJitsiHax("setUserPosition", evt);
    }

    setLocalPosition(evt) {
        this.txJitsiHax("setLocalPosition", evt);
    }
}

class CallaEvent extends Event {
    constructor(data) {
        super(data.command);
        this.data = data;
    }
}

class JitsiClientEvent extends CallaEvent {
    constructor(participantID, data) {
        super(data);
        this.participantID = participantID;
    }
}