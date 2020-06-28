/* global JitsiMeetExternalAPI */

import { BaseJitsiClient } from "./BaseJitsiClient.js";
import { ExternalJitsiAudioClient } from "../audio/ExternalJitsiAudioClient.js";

export class ExternalJitsiClient extends BaseJitsiClient {
    constructor() {
        super();
        this.api = null;
        this.audioClient = null;
    }

    dispose() {
        if (this.api !== null) {
            this.api.dispose();
            this.api = null;
        }
    }

    async initializeAsync(host, roomName) {
        await import(`https://${host}/libs/external_api.min.js`);
        return new Promise((resolve) => {
            this.api = new JitsiMeetExternalAPI(host, {
                parentNode: this.element,
                roomName,
                onload: () => {
                    const iframe = this.api.getIFrame();
                    this.audioClient = new ExternalJitsiAudioClient(
                        host,
                        new URL(iframe.src).origin,
                        iframe.contentWindow);
                    this.audioClient.addEventListener("audioActivity", (evt) => {
                        const evt2 = Event.clone(new Event("audioActivity"), evt);
                        this.dispatchEvent(evt2);
                    });
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

            const reroute = (evtType, test) => {
                test = test || (() => true);

                this.api.addEventListener(evtType, (evt) => {
                    if (test(evt)) {
                        const evt2 = Event.clone(new Event(evtType), evt);
                        if (evtType === "displayNameChange") {

                            // The version of the External API that I'm using
                            // is inconsistent with how parameters are set.
                            if (evt2.id === "local") {
                                evt2.id = null;
                            }

                            // The version of the External API that I'm using 
                            // misspells the name of this field.
                            if (evt2.displayname !== undefined) {
                                evt2.displayName = evt2.displayname;
                            }
                        }

                        this.dispatchEvent(evt2);
                    }
                });
            };

            reroute("videoConferenceJoined");
            reroute("videoConferenceLeft");
            reroute("participantJoined", (evt) => evt.id !== "local");
            reroute("participantLeft");
            reroute("avatarChanged", (evt) => evt.avatarURL !== undefined);
            reroute("displayNameChange");
            reroute("audioMuteStatusChanged");
            reroute("videoMuteStatusChanged");

            this.api.addEventListener("endpointTextMessageReceived", (evt) => {
                this.rxGameData(evt);
            });
        });
    }

    setDisplayName(userName) {
        this.api.executeCommand("displayName", userName);
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

    async isVideoMutedAsync() {
        return await this.api.isVideoMuted();
    }

    txGameData(toUserID, data) {
        this.api.executeCommand("sendEndpointTextMessage", toUserID, JSON.stringify(data));
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
            this.receiveMessageFrom(evt.data.senderInfo.id, data.command, data.value);
        }
    }
}