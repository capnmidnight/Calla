export class MockJitsiMeetExternalAPI extends EventTarget {
    constructor(roomName) {
        super();
        this.roomName = roomName;
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
    }

    dispose() {
    }

    getAvailableDevices() {
        return Promise.resolve(this.availableDevices);
    }

    getCurrentDevices() {
        return Promise.resolve(this.currentDevices);
    }

    setAudioOutputDevice(device) {
        this.currentDevices.audioOutput = device;
    }

    setAudioInputDevice(device) {
        this.currentDevices.audioInput = device;
    }

    setVideoInputDevice(device) {
        this.currentDevices.videoInput = device;
    }

    async isAudioMuted() {
        return this.audioMuted;
    }

    async isVideoMuted() {
        return this.videoMuted;
    }

    executeCommand(command, param) {
        if (command === "displayName") {
            this.dispatchEvent(Object.assign(
                new Event("videoConferenceJoined"),
                {
                    roomName: this.roomName,
                    id: "mock-local-user",
                    displayName: param
                }));
        }
        else if (command === "toggleAudio") {
            this.audioMuted = !this.audioMuted;
        }
        else if (command === "toggleVideo") {
            this.videoMuted = !this.videoMuted;
        }
        else if (command === "hangup") {
            for (let user of testUsers) {
                user.stop();
            }
        }
        else {
            console.log("executeCommand", arguments);
        }
    }
}