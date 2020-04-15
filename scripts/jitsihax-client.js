
// helps us filter out data channel messages that don't belong to us
const LOZYA_FINGERPRINT = "lozya",
    eventNames = ["moveTo", "emote", "userInitRequest", "userInitResponse", "audioMuteStatusChanged", "videoMuteStatusChanged"];

class JitsiClientEvent extends Event {
    constructor(participantID, data) {
        super(data.command);
        this.participantID = participantID;
        this.data = data;
    }
}

// Manages communication between Jitsi Meet and Lozya
class JitsiClient extends EventTarget {
    
    setJitsiApi(api) {
        this.api = api;
        this.iframe = api.getIFrame();
    }

    /// Send a Lozya message through the Jitsi Meet data channel.
    txGameData(id, command, obj) {
        obj = obj || {};
        obj.hax = LOZYA_FINGERPRINT;
        obj.command = command;
        this.api.executeCommand("sendEndpointTextMessage", id, JSON.stringify(obj));
    }

    /// A listener to add to JitsiExternalAPI::endpointTextMessageReceived event
    /// to receive Lozya messages from the Jitsi Meet data channel.
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
        if (data.hax === LOZYA_FINGERPRINT) {
            const evt2 = new JitsiClientEvent(evt.data.senderInfo.id, data);
            this.dispatchEvent(evt2);
        }
    }

    toggleAudio() {
        this.api.executeCommand("toggleAudio");
    }

    toggleVideo() {
        this.api.executeCommand("toggleVideo");
    }

    setAvatar(url) {
        this.api.executeCommand("avatarUrl", url);
    }

    isAudioMuted() {
        return this.api.isAudioMuted();
    }

    isVideoMuted() {
        return this.api.isVideoMuted();
    }

    /// Add a listener for Lozya events that come through the Jitsi Meet data channel.
    addEventListener(evtName, callback) {
        if (eventNames.indexOf[evtName] === -1) {
            throw new Error(`Unsupported event type: ${evtName}`);
        }

        super.addEventListener(evtName, callback);
    }

    /// Send a Lozya message to the jitsihax.js script
    txJitsiHax(command, obj) {
        if (this.iframe) {
            obj.hax = LOZYA_FINGERPRINT;
            obj.command = command;
            this.iframe.contentWindow.postMessage(JSON.stringify(obj), "https://" + JITSI_HOST);
        }
    }
}

export const jitsiClient = new JitsiClient();