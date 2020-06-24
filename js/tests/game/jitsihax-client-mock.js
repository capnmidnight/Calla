import { CallaEvent, CallaUserEvent } from "../../src/events.js";
import { BaseJitsiClient } from "../../src/jitsi/baseClient.js";
import { userNumber } from "../client-tests/userNumber.js";

export class MockJitsiClient extends BaseJitsiClient {
    constructor() {
        super();
        this.host;
        this.testUsers = null;
        this.roomName = null;
        this.userName = null;
        this.audioMuted = false;
        this.videoMuted = true;
        this.availableDevices = {
            audioInput: [{ id: "mock-audio-input", label: "Mock audio input device" }],
            audioOutput: [{ id: "mock-audio-output", label: "Mock audio output device" }],
            videoInput: [{ id: "mock-video-input", label: "Mock video input device" }]
        }

        this.currentDevices = {
            audioInput: this.availableDevices.audioInput[0],
            audioOutput: this.availableDevices.audioOutput[0],
            videoInput: null
        };

        window.addEventListener("message", (evt) => {
            this.rxJitsiHax(evt);
        });
    }

    async initializeAsync(host, roomName) {
        this.host = host;
        this.roomName = roomName;
    }

    setDisplayName(displayName) {
        this.userName = displayName;
        this.dispatchEvent(Object.assign(
            new Event("videoConferenceJoined"),
            {
                roomName: this.roomName,
                id: "mock-local-user-" + userNumber,
                displayName
            }));
    }

    leave() {
        throw new Error("Not implemented in base class");
    }

    async getAudioOutputDevices() {
        return this.availableDevices.audioOutput;
    }

    async getCurrentAudioOutputDevice() {
        return this.currentDevices.audioOutput;
    }

    setAudioOutputDevice(device) {
        this.currentDevices.audioOutput = device;
    }

    async getAudioInputDevices() {
        return this.availableDevices.audioInput;
    }

    async getCurrentAudioInputDevice() {
        return this.currentDevices.audioInput;
    }

    setAudioInputDevice(device) {
        this.currentDevices.audioInput = device;
    }

    async getVideoInputDevices() {
        return this.availableDevices.videoInput;
    }

    async getCurrentVideoInputDevice() {
        return this.currentDevices.videoInput;
    }

    setVideoInputDevice(device) {
        this.currentDevices.videoInput = device;
    }

    toggleAudio() {
        this.audioMuted = !this.audioMuted;
        this.dispatchEvent(Object.assign(new Event("audioMuteStatusChanged"), {
            id: this.localUser,
            muted: this.audioMuted
        }));
    }

    toggleVideo() {
        this.videoMuted = !this.videoMuted;
        this.dispatchEvent(Object.assign(new Event("videoMuteStatusChanged"), {
            id: this.localUser,
            muted: this.videoMuted
        }));
    }

    async isAudioMutedAsync() {
        return this.audioMuted;
    }

    async isVideoMutedAsync() {
        return this.videoMuted;
    }

    setAvatarURL(url) {
        throw new Error("Not implemented in base class");
    }

    sendMessageTo(toUserID, data) {
        if (toUserID === this.localUser) {
            this.dispatchEvent(new CallaUserEvent(data.value.id, data));
        }
        else {
            const user = this.testUsers.filter(u => u.id === toUserID)[0];
            if (!!user) {
                if (data.command === "userInitRequest") {
                    this.userInitResponse(this.localUser, user);
                }
            }
        }
    }

    setAudioProperties(origin, transitionTime, minDistance, maxDistance, rolloff) {
        throw new Error("Not implemented in base class.");
    }

    setPosition(evt) {
        throw new Error("Not implemented in base class.");
    }

    /// Send a Calla message to the jitsihax.js script
    txJitsiHax(command, value) {
        const evt = {
            hax: APP_FINGERPRINT,
            command,
            value
        };
        window.postMessage(JSON.stringify(evt));
    }

    rxJitsiHax(msg) {
        const isLocalHost = msg.origin.match(/^https?:\/\/localhost\b/);
        if (isLocalHost) {
            try {
                const evt = JSON.parse(msg.data);
                if (evt.hax === APP_FINGERPRINT) {
                    const evt2 = new CallaEvent(evt);
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