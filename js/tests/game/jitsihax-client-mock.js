import { BaseJitsiClient } from "../../src/jitsi/BaseJitsiClient.js";
import { userNumber } from "../client-tests/userNumber.js";
import "../../src/audio/ExternalJitsiAudioServer.js";
import { ExternalJitsiAudioClient as AudioClient } from "../../src/audio/ExternalJitsiAudioClient.js";

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
            audioInput: [
                { deviceId: "mock-audio-input-1", label: "Mock audio input device #1" },
                { deviceId: "mock-audio-input-2", label: "Mock audio input device #2" },
                { deviceId: "mock-audio-input-3", label: "Mock audio input device #3" }
            ],
            audioOutput: [
                { deviceId: "mock-audio-output-1", label: "Mock audio output device #1" },
                { deviceId: "mock-audio-output-2", label: "Mock audio output device #2" }
            ],
            videoInput: [
                { deviceId: "mock-video-input-1", label: "Mock video input device #1" },
                { deviceId: "mock-video-input-2", label: "Mock video input device #2" }
            ]
        };

        this.currentDevices = {
            audioInput: this.availableDevices.audioInput[1],
            audioOutput: this.availableDevices.audioOutput[1],
            videoInput: null
        };

        this.audioClient = new AudioClient("jisti.calla.chat", window.location.origin, window);
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
        this.dispatchEvent(Object.assign(new Event("avatarChanged"), {
            avatarURL: url
        }));
    }

    txGameData(toUserID, data) {
        if (toUserID !== this.localUser
            && data.command === "userInitRequest") {
            data.command = "userInitResponse";
            data.value = this.testUsers.filter(u => u.id === toUserID)[0];
            this.rxGameData(toUserID, data);
        }
    }

    rxGameData(fromUserID, data) {
        this.receiveMessageFrom(fromUserID, data.command, data.value);
    }
}