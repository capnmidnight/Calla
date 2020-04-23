// Creates a mock interface for the Jitsi Meet client, to
// be able to test the UI without having to connect to a
// meeting.

import "./protos.js";
import { JitsiClient } from "./jitsihax-client.js";
import { Game } from "./game.js";
import { randomPerson, bestIcons } from "./emoji.js";
import "../etc/jitsihax.js";

class MockJitsiClient extends JitsiClient {
    constructor() {
        super();
        this.audioMuted = false;
        this.videoMuted = true;
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
                const idx = testUsers.findIndex(x => x.id === id),
                    testUser = testUsers[idx];
                testUser.update();
            }
        }
    }

    toggleAudio() {
        this.audioMuted = !this.audioMuted;
        this.mockRxGameData("audioMuteStatusChanged", game.me.id, { muted: this.audioMuted });
    }

    toggleVideo() {
        this.videoMuted = !this.videoMuted;
        this.mockRxGameData("videoMuteStatusChanged", game.me.id, { muted: this.videoMuted });
    }

    isAudioMuted() {
        return Promise.resolve(this.audioMuted);
    }

    isVideoMuted() {
        return Promise.resolve(this.videoMuted);
    }

    setAvatarURL(url) {
        this.mockRxGameData("avatarChanged", game.me.id, { avatarURL: url });
    }
}

class MockJitsiMeetExternalAPI extends EventTarget {
    getIFrame() {
        return {
            src: window.location.href,
            addEventListener: function () { }
        };
    }

    async getAvailableDevices() {
        const current = await this.getCurrentDevices();
        return {
            audioInput: [current.audioInput],
            audioOutput: [current.audioOutput],
            videoInput: [current.videoInput]
        };
    }

    getCurrentDevices() {
        return Promise.resolve({
            audioInput: { id: "mock-audio-input", label: "Mock audio input device" },
            audioOutput: { id: "mock-audio-output", label: "Mock audio output device" },
            videoInput: { id: "mock-video-input", label: "Mock video input device" }
        });
    }

    setAudioOutputDevice(device) {
    }

    setAudioInputDevice(device) {
    }

    setVideoInputDevice(device) {
    }
}

class MockUser {
    constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.audio = null;
    }

    start() {
        const evt = Object.assign(
            new Event("participantJoined"),
            { id: this.id });

        api.dispatchEvent(evt);

        const elementID = `participant_${this.id}`,
            element = document.createElement("span"),
            audio = document.createElement("audio")
        audio.autoplay = "autoplay";
        audio.loop = "loop";
        audio.src = `test-audio/${this.id}.mp3`;
        element.appendChild(audio);

        element.id = elementID;
        document.body.appendChild(element);

        this.audio = audio;
    }

    update() {
        const x = this.x + Math.floor(2 * Math.random() - 1),
            y = this.y + Math.floor(2 * Math.random() - 1);

        jitsiClient.mockRxGameData("moveTo", this.id, { command: "moveTo", x, y });

        if (Math.random() <= 0.1) {
            const groups = Object.values(bestIcons),
                group = groups.random(),
                emoji = group.random();
            jitsiClient.mockRxGameData("emote", this.id, emoji);
        }

        setTimeout(() => this.update(), 1000 * (1 + Math.random()));
    }
}

const jitsiClient = new MockJitsiClient(),
    api = new MockJitsiMeetExternalAPI(),
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
    api,
    game,
    gui
});

gui.setJitsiApi(api);
gui.setJitsiIFrame(api.getIFrame());

game.start({
    id: "me",
    roomName: "default",
    displayName: "Just Rendering🤪",
    avatarURL: null
});

gui.appView.show();
gui.loginView.hide();


(function createTestUser() {
    if (game.userList.length < 5) {
        const idx = game.userList.length - 1,
            user = testUsers[idx];

        user.start();

        setTimeout(createTestUser, 1000);
    }
})();