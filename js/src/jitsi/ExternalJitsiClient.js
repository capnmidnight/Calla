/* global JitsiMeetExternalAPI */

import { BaseJitsiClient } from "./BaseJitsiClient.js";
import { ExternalJitsiAudioClient } from "../audio/ExternalJitsiAudioClient.js";
import { copy } from "../events.js";

const audioActivityEvt = Object.assign(new Event("audioActivity", {
    id: null,
    isActive: false
})),
    evtVideoConferenceJoined = Object.seal({
        roomName: null,
        id: null,
        displayName: null
    }),
    evtVideoConferenceLeft = Object.seal({
        roomName: null
    }),
    evtParticipantLeft = Object.seal({
        id: null
    }),
    evtAvatarChanged = Object.seal({
        id: null,
        avatarURL: null
    }),
    evtParticipantName = Object.seal({
        id: null,
        displayName: null
    }),
    evtMuted = Object.seal({
        id: null,
        muted: null
    });

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
                        audioActivityEvt.id = evt.id;
                        audioActivityEvt.isActive = evt.isActive;
                        this.dispatchEvent(audioActivityEvt);
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

            const reroute = (evtType, dest, test) => {
                this.api.addEventListener(evtType, (rootEvt) => {
                    if (!test || test(rootEvt)) {
                        copy(dest, rootEvt);

                        if (evtType === "displayNameChange") {

                            // The version of the External API that I'm using
                            // is inconsistent with how parameters are set.
                            if (rootEvt.id === "local") {
                                rootEvt.id = null;
                            }

                            // The version of the External API that I'm using 
                            // misspells the name of this field.
                            if (rootEvt.displayname !== undefined) {
                                dest.displayName = rootEvt.displayname;
                            }
                        }

                        if (dest.hasOwnProperty("id")
                            && (rootEvt.id === null
                                || rootEvt.id === undefined)) {
                            dest.id = this.localUser;
                        }

                        const evt = Object.assign(
                            new Event(evtType),
                            dest);
                        this.dispatchEvent(evt);
                    }
                });
            };

            reroute("videoConferenceJoined", evtVideoConferenceJoined);
            reroute("videoConferenceLeft", evtVideoConferenceLeft);
            reroute("participantJoined", evtParticipantName, (evt) => evt.id !== "local");
            reroute("participantLeft", evtParticipantLeft);
            reroute("avatarChanged", evtAvatarChanged, (evt) => evt.avatarURL !== undefined);
            reroute("displayNameChange", evtParticipantName);
            reroute("audioMuteStatusChanged", evtMuted);
            reroute("videoMuteStatusChanged", evtMuted);

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

    sendMessageTo(toUserID, data) {
        this.api.executeCommand("sendEndpointTextMessage", toUserID, JSON.stringify(data));
    }
}