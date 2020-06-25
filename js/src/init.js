// TODO
// set input bindings
// read/write localSettings
// use gamepad manager
// provide gamepad axis binding selector

import { Game } from "./game.js";
import { ToolBar } from "./forms/ToolBar.js/index.js";
import { OptionsForm } from "./forms/OptionsForm.js";
import { EmojiForm } from "./forms/EmojiForm.js";
import { LoginForm } from "./forms/LoginForm.js";

export function init(host, JitsiClientClass) {
    const game = new Game(),
        login = new LoginForm(),
        client = new JitsiClientClass(),
        toolbar = new ToolBar(),
        options = new OptionsForm(),
        emoji = new EmojiForm(),
        forExport = {
            game,
            login,
            client,
            toolbar,
            options,
            emoji
        };

    document.body.append(
        client.element,
        game.element,
        toolbar.element,
        options.element,
        emoji.element,
        login.element);

    game.drawHearing = options.drawHearing;
    game.audioDistanceMin = options.minAudioDistance;
    game.audioDistanceMax = options.maxAudioDistance;
    game.fontSize = options.fontSize;
    game.targetCameraZ = toolbar.zoom;

    refreshGamepads();
    showLogin();

    function showLogin() {
        client.hide();
        game.hide();
        toolbar.hide();
        options.hide();
        emoji.hide();
        login.show();
    }

    async function selectEmojiAsync() {
        const e = await emoji.selectAsync();
        if (!!e) {
            game.emote(game.me.id, e);
            toolbar.setEmojiButton(game.keyEmote, e);
        }
    }

    function setAudioProperties() {
        client.setAudioProperties(
            window.location.origin,
            0.125,
            options.minAudioDistance,
            options.maxAudioDistance,
            options.audioRolloff);
        game.audioDistanceMin = options.minAudioDistance;
        game.audioDistanceMax = options.maxAudioDistance;
    }

    function refreshGamepads() {
        options.gamepads = [...navigator.getGamepads()]
            .filter(g => g !== null);
    }


    window.addEventListener("resize", () => {
        game.resize(toolbar.offsetHeight);
        client.resize(toolbar.offsetHeight);
    });

    window.addEventListener("gamepadconnected", refreshGamepads);
    window.addEventListener("gamepaddisconnected", refreshGamepads);

    toolbar.addEventListener("selectemoji", selectEmojiAsync);

    toolbar.addEventListener("toggleaudio", () => {
        client.toggleAudio();
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

    toolbar.addEventListener("tweet", () => {
        const message = encodeURIComponent(`Join my #TeleParty ${document.location.href}`),
            url = new URL("https://twitter.com/intent/tweet?text=" + message);
        open(url);
    });

    toolbar.addEventListener("toggleui", () => {
        game.setOpen(toolbar.visible);
        game.resize(toolbar.offsetHeight);
        client.resize(toolbar.offsetHeight);
    });

    toolbar.addEventListener("toggleoptions", () => {
        options.toggleOpen();
    });


    login.addEventListener("login", () => {
        client.joinAsync(host, login.selectedRoom, login.userName);
    });


    options.addEventListener("selectavatar", async () => {
        const e = await emoji.selectAsync();
        if (!!e) {
            game.me.avatarEmoji = e;
            options.setAvatarEmoji(e);
        }
    });

    options.addEventListener("avatarurlchanged", () => {
        client.setAvatarURL(options.avatarURL);
    });

    options.addEventListener("audiopropschanged", setAudioProperties);

    options.addEventListener("togglevideo", () => {
        client.toggleVideo();
    });

    options.addEventListener("toggledrawhearing", () => {
        game.drawHearing = options.drawHearing = !options.drawHearing;
    });

    options.addEventListener("fontsizechanged", () => {
        game.fontSize = options.fontSize;
    });

    options.addEventListener("audioinputchanged", () => {
        client.setAudioInputDevice(options.currentAudioInputDevice);
    });

    options.addEventListener("audiooutputchanged", () => {
        client.setAudioOutputDevice(options.currentAudioOutputDevice);
    });

    options.addEventListener("videoinputchanged", () => {
        client.setVideoInputDevice(options.currentVideoInputDevice);
    });

    options.addEventListener("gamepadchanged", () => {
        game.gamepadIndex = options.currentGamepadIndex;
    });


    game.addEventListener("emote", (evt) => {
        client.emote(evt.emoji);
    });

    game.addEventListener("userjoined", (evt) => {
        evt.user.addEventListener("userPositionNeeded", (evt2) => {
            client.userInitRequest(evt2.id);
        });
    });

    game.addEventListener("toggleaudio", async (evt) => {
        client.toggleAudio();
    });

    game.addEventListener("togglevideo", async (evt) => {
        client.toggleVideo();
    });

    game.addEventListener("gamestarted", () => {
        game.me.addEventListener("userMoved", (evt) => {
            client.setPosition(evt);
        });
        setAudioProperties();
        login.hide();
        toolbar.show();
        client.show();
        client.setPosition(game.me);
        options.setAvatarEmoji(game.me.avatarEmoji);
    });

    game.addEventListener("gameended", () => {
        game.hide();
        client.hide();
        login.connected = false;
        showLogin();
    });

    game.addEventListener("emojineeded", selectEmojiAsync);

    game.addEventListener("zoomchanged", () => {
        toolbar.zoom = game.targetCameraZ;
    });

    client.addEventListener("videoConferenceJoined", async (evt) => {
        login.connected = true;

        game.start(evt);
        for (let user of client.otherUsers.entries()) {
            game.addUser({
                id: user[0],
                displayName: user[1]
            });
        }

        options.audioInputDevices = await client.getAudioInputDevices();
        options.audioOutputDevices = await client.getAudioOutputDevices();
        options.videoInputDevices = await client.getVideoInputDevices();

        options.currentAudioInputDevice = await client.getCurrentAudioInputDevice();
        options.currentAudioOutputDevice = await client.getCurrentAudioOutputDevice();
        options.currentVideoInputDevice = await client.getCurrentVideoInputDevice();

        const audioMuted = await client.isAudioMutedAsync();
        game.muteUserAudio({ id: client.localUser, muted: audioMuted });
        toolbar.audioEnabled = !audioMuted;

        const videoMuted = await client.isVideoMutedAsync();
        game.muteUserVideo({ id: client.localUser, muted: videoMuted });
        options.videoEnabled = !videoMuted;
    });

    client.addEventListener("videoConferenceLeft", (evt) => {
        if (evt.roomName.toLowerCase() === game.currentRoomName) {
            game.end();
        }
    });

    client.addEventListener("participantJoined", (evt) => {
        game.addUser(evt);
    });

    client.addEventListener("participantLeft", (evt) => {
        game.removeUser(evt);
        client.removeUser(evt);
    });

    client.addEventListener("avatarChanged", (evt) => {
        game.setAvatarURL(evt);
    });

    client.addEventListener("displayNameChange", (evt) => {
        game.changeUserName(evt);
    });

    client.addEventListener("audioMuteStatusChanged", (evt) => {
        game.muteUserAudio(evt);
        if (evt.id === client.localUser) {
            toolbar.audioEnabled = !evt.muted;
        }
    });

    client.addEventListener("videoMuteStatusChanged", (evt) => {
        game.muteUserVideo(evt);
        if (evt.id === client.localUser) {
            options.videoEnabled = !evt.muted;
        }
    });

    client.addEventListener("userInitRequest", (evt) => {
        client.userInitResponse(evt.id, game.me);
    });

    client.addEventListener("userInitResponse", (evt) => {
        const user = game.userLookup[evt.id];
        if (!!user) {
            user.init(evt);
            client.setPosition(evt);
        }
    });

    client.addEventListener("userMoved", (evt) => {
        const user = game.userLookup[evt.id];
        if (!!user) {
            user.moveTo(evt.x, evt.y);
            client.setPosition(evt);
        }
    });

    client.addEventListener("emote", (evt) => {
        game.emote(evt.id, evt);
    });

    client.addEventListener("audioActivity", (evt) => {
        game.updateAudioActivity(evt);
    });

    client.addEventListener("avatarChanged", (evt) => {
        console.log(evt);
        options.avatarURL = evt.avatarURL;
        game.me.setAvatarURL(evt.avatarURL);
    });

    login.ready = true;
    return forExport;
}