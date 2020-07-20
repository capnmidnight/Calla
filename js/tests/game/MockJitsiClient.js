import { BaseJitsiClient } from "../../src/jitsi/BaseJitsiClient.js";
import { userNumber } from "../../testing/userNumber.js";
import { AudioManager as AudioClient } from "../../src/audio/AudioManager.js";

export class MockJitsiClient extends BaseJitsiClient {
    constructor() {
        super();
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

    async initializeAsync(roomName, userName) {
        this.roomName = roomName;
        this.userName = userName;

        this.dispatchEvent(Object.assign(
            new Event("videoConferenceJoined"),
            {
                id: "mock-local-user-" + userNumber,
                roomName: roomName,
                displayName: userName
            }));
    }

    leave() {
    }

    setDisplayName(displayName) {
        this.userName = displayName;
    }

    async getAudioOutputDevicesAsync() {
        return this.availableDevices.audioOutput;
    }

    async getCurrentAudioOutputDeviceAsync() {
        return this.currentDevices.audioOutput;
    }

    setAudioOutputDeviceAsync(device) {
        this.currentDevices.audioOutput = device;
    }

    async getAudioInputDevicesAsync() {
        return this.availableDevices.audioInput;
    }

    async getCurrentAudioInputDeviceAsync() {
        return this.currentDevices.audioInput;
    }

    async setAudioInputDeviceAsync(device) {
        this.currentDevices.audioInput = device;
    }

    async getVideoInputDevicesAsync() {
        return this.availableDevices.videoInput;
    }

    async getCurrentVideoInputDeviceAsync() {
        return this.currentDevices.videoInput;
    }

    async setVideoInputDeviceAsync(device) {
        this.currentDevices.videoInput = device;
    }

    async toggleAudioMutedAsync() {
        this.audioMuted = !this.audioMuted;
        this.dispatchEvent(Object.assign(
            new Event("audioMuteStatusChanged"), {
            muted: this.audioMuted
        }));
        return this.audioMuted;
    }

    async toggleVideoMutedAsync() {
        this.videoMuted = !this.videoMuted;
        this.dispatchEvent(Object.assign(
            new Event("videoMuteStatusChanged"), {
            muted: this.videoMuted
        }));
        return this.videoMuted;
    }

    get isAudioMuted() {
        return this.audioMuted;
    }

    get isVideoMuted() {
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
            const user = this.testUsers.filter(u => u.id === toUserID)[0];
            this.receiveMessageFrom(toUserID, "userInitResponse", user.serialize());
        }
    }

    rxGameData(evt) {
    }

    startAudio() {
        this.audioClient.start();
    }
}