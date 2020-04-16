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
                hax: "lozya",
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
                mover(id);
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


function mover(id) {
    jitsiClient.mockRxGameData("moveTo", id, {
        command: "moveTo",
        x: Math.floor(Math.random() * 10 - 5),
        y: Math.floor(Math.random() * 10 - 5)
    });
    
    if (Math.random() <= 0.1) {
        const groups = Object.values(bestIcons),
            group = groups.random(),
            emoji = group.random();
        jitsiClient.mockRxGameData("emote", id, emoji);
    }

    setTimeout(() => mover(id), 1000 * (1 + Math.random()));
}

function createTestUser() {
    if (game.userList.length < 5) {
        const id = `user${game.userList.length + 1}`,
            evt = Object.assign(
                new Event("participantJoined"),
                { id });
        api.dispatchEvent(evt);

        setTimeout(createTestUser, 1000);
    }
}

const jitsiClient = new MockJitsiClient(),
    api = new MockJitsiMeetExternalAPI(),
    game = new Game(jitsiClient);

jitsiClient.setJitsiApi(api);

game.registerGameListeners(api);
game.start({
    id: "me",
    roomName: "default",
    displayName: "Just Rendering🤪",
    avatarURL: null
});

game.gui.appView.show();
game.gui.loginView.hide();

window.game = game;

createTestUser();