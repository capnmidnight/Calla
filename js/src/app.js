import { Game } from "./game.js";
import { AppGui } from "./appgui.js";

export function init(JitsiClientClass, appViewElement) {
    const jitsiClient = new JitsiClientClass(),
        game = new Game(),
        gui = new AppGui(appViewElement, game, jitsiClient);

    Object.assign(window, {
        jitsiClient,
        game,
        gui
    });

    if (gui.toolbar) {
        gui.toolbar.advertise();
    }

    jitsiClient.addEventListener("videoConferenceJoined", (evt) => {
        game.start(evt);
    });

    jitsiClient.addEventListener("videoConferenceLeft", (evt) => {
        if (evt.roomName.toLowerCase() === game.currentRoomName) {
            game.end();
        }
    });

    jitsiClient.addEventListener("participantJoined", (evt) => {
        game.addUser(evt);
    });

    jitsiClient.addEventListener("participantLeft", (evt) => {
        game.removeUser(evt);
    });
    jitsiClient.addEventListener("avatarChanged", (evt) => {
        game.setAvatarURL(evt);
    });
    jitsiClient.addEventListener("displayNameChange", (evt) => {
        game.changeUserName(evt);
    });
    jitsiClient.addEventListener("audioMuteStatusChanged", (evt) => {
        game.muteUserAudio(evt);
    });
    jitsiClient.addEventListener("videoMuteStatusChanged", (evt) => {
        game.muteUserVideo(evt);
    });

    jitsiClient.addEventListener("userInitRequest", (evt) => {
        jitsiClient.sendUserState(evt.participantID, game.me);
    });

    jitsiClient.addEventListener("userInitResponse", (evt) => {
        const user = game.userLookup[evt.participantID];
        if (!!user) {
            user.init(evt.data);
        }
    });

    jitsiClient.addEventListener("moveTo", (evt) => {
        const user = game.userLookup[evt.participantID];
        if (!!user) {
            user.moveTo(evt.data.x, evt.data.y);
            jitsiClient.setUserPosition(evt);
        }
    });

    jitsiClient.addEventListener("emote", (evt) => {
        game.emote(evt.participantID, evt.data);
    });

    jitsiClient.addEventListener("audioActivity", (evt) => {
        game.updateAudioActivity(evt);
    });

    game.addEventListener("emote", (evt) => {
        jitsiClient.sendEmote(evt.participantID, evt.emoji);
    });

    game.addEventListener("audiomuted", async (evt) => {
        gui.setUserAudioMuted(evt.muted);
        await jitsiClient.setAudioMutedAsync(evt.muted);
        for (let user of game.userList) {
            if (!user.isMe) {
                jitsiClient.sendAudioMuteState(user.id, evt.muted);
            }
        }
    });

    game.addEventListener("videomuted", async (evt) => {
        gui.setUserVideoMuted(evt.muted);
        await jitsiClient.setVideoMutedAsync(evt.muted);
        for (let user of game.userList) {
            if (!user.isMe) {
                jitsiClient.sendVideoMuteState(user.id, evt.muted);
            }
        }
    });

    game.addEventListener("gamestarted", () => {
        gui.loginView.hide();
        gui.resize();

        game.me.addEventListener("moveTo", (evt) => {
            jitsiClient.updatePosition(evt);
            for (let user of game.userList) {
                if (!user.isMe) {
                    jitsiClient.sendPosition(user.id, evt);
                }
            }
        });
    });

    game.addEventListener("userjoined", (evt) => {
        evt.user.addEventListener("userInitRequest", (evt2) => {
            jitsiClient.requestUserState(evt2.participantID);
        });
    });

    game.addEventListener("gameended", () => {
        gui.showLogin();
    });

    game.addEventListener("emojineeded", () => {
        gui.selectEmojiAsync();
    });

    return game;
}