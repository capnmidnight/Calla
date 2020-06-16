import { Game } from "./game.js";
import { ToolBar } from "./toolbar.js";
import { AppGui } from "./appgui.js";

export function init(JitsiClientClass, appViewElement) {
    const game = new Game(),
        jitsiClient = new JitsiClientClass(),
        toolbar = new ToolBar(),
        gui = new AppGui(appViewElement, game, jitsiClient);

    Object.assign(window, {
        jitsiClient,
        game,
        toolbar,
        gui
    });

    appViewElement.appendChild(toolbar.element);

    game.addEventListener("emote", (evt) => {
        jitsiClient.sendEmote(evt.participantID, evt.emoji);
    });

    game.addEventListener("audiomuted", async (evt) => {
        await jitsiClient.setAudioMutedAsync(evt.muted);
        for (let user of game.userList) {
            if (!user.isMe) {
                jitsiClient.sendAudioMuteState(user.id, evt.muted);
            }
        }
    });

    game.addEventListener("videomuted", async (evt) => {
        await jitsiClient.setVideoMutedAsync(evt.muted);
        for (let user of game.userList) {
            if (!user.isMe) {
                jitsiClient.sendVideoMuteState(user.id, evt.muted);
            }
        }
    });

    game.addEventListener("gamestarted", () => {
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

    game.addEventListener("audiomuted", async (evt) => {
        toolbar.setAudioMuted(evt.muted);
    });

    game.addEventListener("videomuted", async (evt) => {
        gui.setUserVideoMuted(evt.muted);
    });

    game.addEventListener("gamestarted", () => {
        gui.loginView.hide();
        gui.resize();
    });

    game.addEventListener("gameended", () => {
        gui.showLogin();
    });

    game.addEventListener("emojineeded", () => {
        gui.selectEmojiAsync();
    });

    game.addEventListener("zoomchanged", () => {
        toolbar.zoom = game.targetCameraZ;
    });


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


    toolbar.addEventListener("toggleaudio", () => {
        jitsiClient.toggleAudio();
    });

    toolbar.addEventListener("leave", () => {
        game.end();
    });

    toolbar.addEventListener("emote", () => {
        game.emote(game.me.id, game.currentEmoji);
    });

    toolbar.addEventListener("zoomchanged", () => {
        game.targetCameraZ = toolbar.zoom;
    });

    toolbar.addEventListener("selectemoji", () => {
        gui.selectEmojiAsync();
    });

    toolbar.addEventListener("tweet", () => {
        const message = encodeURIComponent(`Join my #TeleParty ${document.location.href}`),
            url = new URL("https://twitter.com/intent/tweet?text=" + message);
        open(url);
    });

    toolbar.addEventListener("toggleui", () => {
        game.frontBuffer.setOpen(toolbar.visible);
    });

    toolbar.addEventListener("toggleui", () => {
        gui.resize();
    });

    toolbar.addEventListener("options", () => {
        gui.showOptions();
    });

    window.addEventListener("resize", () => {
        gui.resize();
        game.frontBuffer.resize();
    });

    return {
        jitsiClient,
        game,
        toolbar,
        gui
    };
}