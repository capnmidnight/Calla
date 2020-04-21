// Creates a mock interface for the Jitsi Meet client, to
// be able to test the UI without having to connect to a
// meeting.

import "./protos.js";
import { JitsiClient } from "./jitsihax-client.js";
import { Game } from "./game.js";
import { randomPerson, bestIcons } from "./emoji.js";

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

    txJitsiHax(command, obj) {
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
            addEventListener: function () { }
        };
    }
};

class TestUser {
    constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
    }

    start() {
        const evt = Object.assign(
            new Event("participantJoined"),
            { id: this.id });

        api.dispatchEvent(evt);
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

const testUsers = [
    new TestUser("user1", -5, -5),
    new TestUser("user2", -5, 5),
    new TestUser("user3", 5, -5),
    new TestUser("user4", 5, 5),
    new TestUser("user5", 0, 0)
];

function createTestUser() {
    if (game.userList.length < 5) {
        const idx = game.userList.length - 1,
            user = testUsers[idx];

        user.start();

        setTimeout(createTestUser, 1000);
    }
}

const jitsiClient = new MockJitsiClient(),
    api = new MockJitsiMeetExternalAPI(),
    game = new Game(jitsiClient),
    gui = game.gui;

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

createTestUser();