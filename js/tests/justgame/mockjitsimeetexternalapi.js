export class MockJitsiMeetExternalAPI extends EventTarget {
    constructor(host, options) {
        super();
        this.options = options;
        this.audioMuted = false;
        this.videoMuted = true;
        this.currentDevices = {
            audioInput: { id: "mock-audio-input", label: "Mock audio input device" },
            audioOutput: { id: "mock-audio-output", label: "Mock audio output device" },
            videoInput: { id: "mock-video-input", label: "Mock video input device" }
        };
    }

    dispose() {
    }

    getIFrame() {
        return {
            src: window.location.href,
            addEventListener: function () { }
        };
    }

    getAvailableDevices() {
        return Promise.resolve({
            audioInput: [this.currentDevices.audioInput],
            audioOutput: [this.currentDevices.audioOutput],
            videoInput: [this.currentDevices.videoInput]
        });
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

    isAudioMuted() {
        return Promise.resolve(this.audioMuted);
    }

    isVideoMuted() {
        return Promise.resolve(this.videoMuted);
    }

    executeCommand(command, param) {
        if (command === "displayName") {
            this.dispatchEvent(Object.assign(
                new Event("videoConferenceJoined"),
                {
                    roomName: this.options.roomName,
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