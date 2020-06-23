import { Game } from "./game.js";
import { ToolBar } from "./forms/toolbar.js";
import { OptionsForm } from "./forms/optionsForm.js";
import { EmojiForm } from "./forms/emojiForm.js";
import { LoginForm } from "./forms/loginForm.js";

export function init(JitsiClientClass) {
    const game = new Game(),
        loginForm = new LoginForm(),
        jitsiClient = new JitsiClientClass(),
        toolbar = new ToolBar(),
        optionsForm = new OptionsForm(),
        emojiForm = new EmojiForm(),
        forExport = {
            game,
            loginForm,
            jitsiClient,
            toolbar,
            optionsForm,
            emojiForm
        };

    Object.assign(window, forExport);

    function showLogin() {
        jitsiClient.element.hide();
        game.frontBuffer.hide();
        toolbar.hide();
        optionsForm.hide();
        emojiForm.hide();
        loginForm.show();
    }

    showLogin();

    document.body.append(
        jitsiClient.element,
        game.frontBuffer,
        toolbar.element,
        optionsForm.element,
        emojiForm.element,
        loginForm.element);

    async function selectEmojiAsync() {
        const emoji = await emojiForm.selectAsync();
        if (!!emoji) {
            game.emote(game.me.id, emoji);
            toolbar.setEmojiButton(game.keyEmote, emoji);
        }
    }

    loginForm.addEventListener("login", () => {
        console.log("LOGGING IN");
    });


    game.addEventListener("emote", (evt) => {
        jitsiClient.emote(evt.emoji);
    });

    game.addEventListener("audiomuted", async (evt) => {
        await jitsiClient.setAudioMutedAsync(evt.muted);
    });

    game.addEventListener("videomuted", async (evt) => {
        await jitsiClient.setVideoMutedAsync(evt.muted);
    });

    game.addEventListener("gamestarted", () => {
        game.me.addEventListener("userMoved", (evt) => {
            jitsiClient.setPosition(evt);
        });
    });

    game.addEventListener("userjoined", (evt) => {
        evt.user.addEventListener("userInitRequest", (evt2) => {
            jitsiClient.userInitRequest(evt2.id);
        });
    });

    game.addEventListener("audiomuted", async (evt) => {
        toolbar.setAudioMuted(evt.muted);
    });

    game.addEventListener("videomuted", async (evt) => {
        //gui.setUserVideoMuted(evt.muted);
    });

    game.addEventListener("gamestarted", () => {
        loginView.hide();
        //gui.resize(toolbar.offsetHeight);
    });

    game.addEventListener("gameended", () => {
        //gui.showLogin();
    });

    game.addEventListener("emojineeded", selectEmojiAsync);

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
        jitsiClient.userInitResponse(evt.id, game.me);
    });

    jitsiClient.addEventListener("userInitResponse", (evt) => {
        const user = game.userLookup[evt.id];
        if (!!user) {
            user.init(evt.data);
        }
    });

    jitsiClient.addEventListener("userMoved", (evt) => {
        const user = game.userLookup[evt.id];
        if (!!user) {
            user.moveTo(evt.x, evt.y);
            jitsiClient.setPosition(evt);
        }
    });

    jitsiClient.addEventListener("emote", (evt) => {
        game.emote(evt.id, evt.data);
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

    toolbar.addEventListener("selectemoji", selectEmojiAsync);

    toolbar.addEventListener("tweet", () => {
        const message = encodeURIComponent(`Join my #TeleParty ${document.location.href}`),
            url = new URL("https://twitter.com/intent/tweet?text=" + message);
        open(url);
    });

    toolbar.addEventListener("toggleui", () => {
        game.frontBuffer.setOpen(toolbar.visible);
    });

    toolbar.addEventListener("toggleui", () => {
        //gui.resize(toolbar.offsetHeight);
    });

    toolbar.addEventListener("options", () => {
        //gui.showOptions();
    });


    window.addEventListener("resize", () => {
        //gui.resize(toolbar.offsetHeight);
    });

    window.addEventListener("resize", () => {
        game.frontBuffer.resize();
    });

    loginForm.ready = true;
    return forExport;
}