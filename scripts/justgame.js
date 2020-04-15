// Creates a mock interface for the Jitsi Meet client, to
// be able to test the UI without having to connect to a
// meeting.

import "./protos.js";
import { Game } from "./game.js";
import { randomPerson, bestIcons } from "./emoji.js";

function mover(id) {
    for (let func of jitsiEvents.moveTo) {
        func({
            participantID: id,
            data: {
                x: Math.floor(Math.random() * 10 - 5),
                y: Math.floor(Math.random() * 10 - 5)
            }
        });
    }

    if (Math.random() <= 0.1) {
        const groups = Object.values(bestIcons),
            group = groups.random(),
            emoji = group.random(),
            evt = { participantID: id, data: emoji };

        for (let func of jitsiEvents.emote) {
            func(evt);
        }
    }

    setTimeout(mover.bind(null, id), 1000 * (1 + Math.random()));
}

let audioMuted = false,
    videoMuted = true;

const jitsiEvents = {
    moveTo: [],
    emote: [],
    userInitRequest: [],
    userInitResponse: [],
    audioMuteStatusChanged: [],
    videoMuteStatusChanged: []
},
    jitsiClient = {
        addEventListener: function (evt, func) {
            jitsiEvents[evt].push(func);
        },

        txGameData: function (id, msg, data) {
            if (msg === "userInitRequest") {
                const user = game.userLookup[id];
                if (!!user) {
                    const evt = {
                        participantID: id,
                        data: Object.assign({}, user, { avatarEmoji: randomPerson().value })
                    };
                    for (let func of jitsiEvents.userInitResponse) {
                        func(evt);
                    }
                }
            }
        },

        rxGameData: function () { },

        txJitsiHax: function () { },

        toggleAudio: function () {
            audioMuted = !audioMuted;
            const evt = { participantID: game.me.id, data: { muted: audioMuted } };
            for (let func of apiEvents.audioMuteStatusChanged) {
                func(evt);
            }
        },

        toggleVideo: function () {
            videoMuted = !videoMuted;
            const evt = { participantID: game.me.id, data: { muted: videoMuted } };
            for (let func of apiEvents.videoMuteStatusChanged) {
                func(evt);
            }
        },

        isAudioMuted: function () {
            return Promise.resolve(audioMuted);
        },

        isVideoMuted: function () {
            return Promise.resolve(videoMuted);
        },

        setAvatarURL: function (url) {
            for (let func of apiEvents.avatarChanged) {
                func({ id: game.me.id, avatarURL: url });
            }
        }

    },
    apiEvents = {
        videoConferenceJoined: [],
        videoConferenceLeft: [],
        participantJoined: [],
        participantLeft: [],
        avatarChanged: [],
        endpointTextMessageReceived: [],
        displayNameChange: [],
        audioMuteStatusChanged: [],
        videoMuteStatusChanged: []
    },
    api = {
        addEventListener: function (evt, func) {
            apiEvents[evt].push(func);
        },
        createTestUser: function () {
            if (game.userList.length < 5) {
                const id = `user${game.userList.length + 1}`,
                    evt = { id };
                for (let func of apiEvents.participantJoined) {
                    func(evt);
                }

                setTimeout(mover.bind(null, id), 1000);
                setTimeout(api.createTestUser, 1000);
            }
        }
    },
    game = new Game(jitsiClient);

game.registerGameListeners(api);
game.start({
    id: "me",
    roomName: "default",
    displayName: "Just Rendering🤪",
    avatarURL: null
});

game.gui.appView.show();
game.gui.loginView.hide();

const vid = document.createElement("video");
vid.src = "videos/demo.webm";
vid.style.height = "100%";
game.gui.jitsiContainer.appendChild(vid);
vid.loop = "loop";
vid.play();

setTimeout(api.createTestUser, 1000);

window.game = game;