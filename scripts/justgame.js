// Creates a mock interface for the Jitsi Meet client, to
// be able to test the UI without having to connect to a
// meeting.

import "./protos.js";
import { JitsiClient } from "./jitsihax-client.js";
import { Game } from "./game.js";
import { randomPerson, allIcons as icons } from "./emoji.js";
import { audio, span } from "./html.js";
import "../etc/jitsihax.js";

class MockJitsiClient extends JitsiClient {
    constructor(ApiClass) {
        super(ApiClass);
    }

    mockRxGameData(command, id, data) {
        data = Object.assign({},
            data,
            {
                hax: "Calla",
                command
            });

        const text = JSON.stringify(data);

        this.rxGameData({
            data: {
                senderInfo: {
                    id
                },
                eventData: {
                    text
                }
            }
        });
    }

    txGameData(id, msg, data) {
        if (msg === "userInitRequest") {
            const user = game.userLookup[id];
            if (!!user) {
                user.avatarEmoji = randomPerson().value;
                this.mockRxGameData("userInitResponse", id, user);
            }
        }
    }

    toggleAudio() {
        super.toggleAudio();
        this.mockRxGameData("audioMuteStatusChanged", game.me.id, { muted: this.api.audioMuted });
    }

    toggleVideo() {
        super.toggleVideo();
        this.mockRxGameData("videoMuteStatusChanged", game.me.id, { muted: this.api.videoMuted });
    }

    setAvatarURL(url) {
        super.setAvatarURL(url);
        this.mockRxGameData("avatarChanged", game.me.id, { avatarURL: url });
    }
}

class MockJitsiMeetExternalAPI extends EventTarget {
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

class MockUser {
    constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.audio = null;
    }

    schedule() {
        this.timeout = setTimeout(
            () => this.update(),
            1000 * (1 + Math.random()));
    }

    start() {
        const evt = Object.assign(
            new Event("participantJoined"),
            { id: this.id });

        jitsiClient.api.dispatchEvent(evt);

        document.body.appendChild(span({ id: `participant_${this.id}` },
            this.audio = audio({
                autoplay: "autoplay",
                loop: "loop",
                src: `test-audio/${this.id}.mp3`
            })));

        this.schedule();
    }

    stop() {
        clearTimeout(this.timeout);
        if (!!this.audio) {
            this.audio.pause();
            document.body.removeChild(this.audio.parentElement);
        }
    }

    update() {
        const x = this.x + Math.floor(2 * Math.random() - 1),
            y = this.y + Math.floor(2 * Math.random() - 1);

        jitsiClient.mockRxGameData("moveTo", this.id, { command: "moveTo", x, y });

        if (Math.random() <= 0.1) {
            const groups = Object.values(icons),
                group = groups.random(),
                emoji = group.random();
            jitsiClient.mockRxGameData("emote", this.id, emoji);
        }

        this.schedule();
    }
}

const jitsiClient = new MockJitsiClient(MockJitsiMeetExternalAPI),
    game = new Game(jitsiClient),
    gui = game.gui,
    testUsers = [
        new MockUser("user1", -5, -5),
        new MockUser("user2", -5, 5),
        new MockUser("user3", 5, -5),
        new MockUser("user4", 5, 5),
        new MockUser("user5", 0, 0)
    ];

Object.assign(window, {
    jitsiClient,
    game,
    gui
});

game.addEventListener("gameStarted", function createTestUser() {
    if (game.userList.length < 5) {
        const idx = game.userList.length - 1,
            user = testUsers[idx];
        user.start();
        setTimeout(createTestUser, 1000);
    }
});