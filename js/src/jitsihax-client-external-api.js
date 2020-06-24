import { CallaEvent } from "./events.js";
import { BaseJitsiClient } from "./jitsihax-client-base.js";

export class ExternalJitsiClient extends BaseJitsiClient {
    constructor() {
        super();
        this.api = null;
        this.apiOrigin = null;
        this.apiWindow = null;
        window.addEventListener("message", this.rxJitsiHax.bind(this));
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
                    this.apiOrigin = new URL(iframe.src).origin;
                    this.apiWindow = iframe.contentWindow;
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
                    const clone = copy(rootEvt);
                    if (clone !== undefined) {
                        const evt = Object.assign(
                            new Event(evtType),
                            clone);
                        this.dispatchEvent(evt);
                    }
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
                if (evt.id !== "local") {
                    return {
                        id: evt.id,
                        displayName: evt.displayName
                    };
                }
            });

            reroute("participantLeft", (evt) => {
                return {
                    id: evt.id
                };
            });

            reroute("avatarChanged", (evt) => {
                if (evt.avatarURL !== undefined) {
                    return {
                        id: evt.id,
                        avatarURL: evt.avatarURL
                    };
                }
            });

            reroute("displayNameChange", (evt) => {
                return {
                    id: evt.id,

                    // The External API misnames this, 
                    // so we guard against future change.
                    displayName: evt.displayName
                        || evt.displayname
                };
            });

            reroute("audioMuteStatusChanged", (evt) => {
                return {
                    id: this.localUser,
                    muted: evt.muted
                };
            });

            reroute("videoMuteStatusChanged", (evt) => {
                return {
                    id: this.localUser,
                    muted: evt.muted
                };
            });

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

    setPosition(evt) {
        if (evt.id === this.localUser) {
            this.txJitsiHax("setLocalPosition", evt);
            for (let toUserID of this.otherUsers.keys()) {
                this.txGameData(toUserID, "userMoved", evt);
            }
        }
        else {
            this.txJitsiHax("setUserPosition", evt);
        }
    }
}