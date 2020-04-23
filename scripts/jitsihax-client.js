
// helps us filter out data channel messages that don't belong to us
const APP_FINGERPRINT = "Calla",
    eventNames = ["moveTo", "emote", "userInitRequest", "userInitResponse", "audioMuteStatusChanged", "videoMuteStatusChanged"];

// Manages communication between Jitsi Meet and Calla
export class JitsiClient extends EventTarget {

    constructor() {
        super();
        addEventListener("message", this.rxJitsiHax.bind(this));
    }

    setJitsiApi(api) {
        this.api = api;
        this.api.addEventListener("endpointTextMessageReceived",
            this.rxGameData.bind(this));
    }

    setJitsiIFrame(iframe) {
        this.iframe = iframe;
        this.apiOrigin = new URL(iframe.src).origin;
        this.apiWindow = this.iframe.contentWindow || window;
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

    isAudioMuted() {
        return this.api.isAudioMuted();
    }

    isVideoMuted() {
        return this.api.isVideoMuted();
    }

    /// Add a listener for Calla events that come through the Jitsi Meet data channel.
    addEventListener(evtName, callback) {
        if (eventNames.indexOf[evtName] === -1) {
            throw new Error(`Unsupported event type: ${evtName}`);
        }

        super.addEventListener(evtName, callback);
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

    requestUserState(ofUserID) {
        this.txGameData(ofUserID, "userInitRequest");
    }

    sendUserState(toUserID, fromUser) {
        this.txGameData(toUserID, "userInitResponse", fromUser);
    }

    sendEmote(toUserID, emoji) {
        this.txGameData(toUserID, "emote", emoji);
    }

    sendAudioMuteState(toUserID, muted) {
        this.txGameData(toUserID, "audioMuteStatusChanged", { muted });
    }

    sendVideoMuteState(toUserID, muted) {
        this.txGameData(toUserID, "videoMuteStatusChanged", { muted });
    }

    setUserPosition(evt) {
        this.txJitsiHax("setUserPosition", evt);
    }

    sendPosition(toUserID, evt) {
        this.txGameData(toUserID, "moveTo", evt);
    }

    updatePosition(evt) {
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