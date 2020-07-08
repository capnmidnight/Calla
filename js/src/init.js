import { EmojiForm } from "./forms/EmojiForm.js";
import { InstructionsForm } from "./forms/InstructionsForm.js";
import { LoginForm } from "./forms/LoginForm.js";
import { OptionsForm } from "./forms/OptionsForm.js";
import { HeaderBar } from "./forms/HeaderBar.js";
import { FooterBar } from "./forms/FooterBar.js";
import { Game } from "./Game.js";
import { Settings } from "./Settings.js";
import { BaseJitsiClient } from "./jitsi/BaseJitsiClient.js";
import { grid } from "./html/attrs.js";

/**
 * 
 * @param {string} host
 * @param {BaseJitsiClient} client
 */
export function init(host, client) {
    const settings = new Settings(),
        game = new Game(),
        login = new LoginForm(),
        headbar = new HeaderBar(),
        footbar = new FooterBar(),
        options = new OptionsForm(),
        emoji = new EmojiForm(),
        instructions = new InstructionsForm(),

        forExport = {
            settings,
            client,
            game,
            login,
            headbar,
            footbar,
            options,
            emoji,
            instructions
        },

        forAppend = [
            game,
            instructions,
            options,
            emoji,
            login,
            headbar,
            footbar
        ].filter(x => x.element);

    document.body.style.display = "grid";
    document.body.style.gridTemplateRows = "auto 1fr auto";
    let z = 0;
    for (let e of forAppend) {
        if (e.element) {
            let y = 2;
            if (e === headbar) {
                y = 1;
            }
            else if (e === footbar) {
                y = 3;
            }
            grid(1, y).apply(e.element);
            e.element.style.zIndex = (z++);
            document.body.append(e.element);
        }
    }

    refreshGamepads();
    headbar.enabled = false;
    footbar.enabled = false;
    options.drawHearing = game.drawHearing = settings.drawHearing;
    options.audioDistanceMin = game.audioDistanceMin = settings.audioDistanceMin;
    options.audioDistanceMax = game.audioDistanceMax = settings.audioDistanceMax;
    options.audioRolloff = settings.audioRolloff;
    options.fontSize = game.fontSize = settings.fontSize;
    options.gamepadIndex = game.gamepadIndex = settings.gamepadIndex;
    options.inputBinding = game.inputBinding = settings.inputBinding;
    game.cameraZ = game.targetCameraZ = settings.zoom;
    login.userName = settings.userName;
    login.roomName = settings.roomName;

    showLogin();

    function showLogin() {
        game.hide();
        options.hide();
        emoji.hide();
        instructions.hide();
        headbar.enabled = false;
        footbar.enabled = false;
        login.show();
    }

    async function withEmojiSelection(callback) {
        if (!emoji.isOpen()) {
            headbar.optionsButton.lock();
            headbar.instructionsButton.lock();
            options.hide();
            instructions.hide();
            const e = await emoji.selectAsync();
            if (!!e) {
                callback(e);
            }
            headbar.optionsButton.unlock();
            headbar.instructionsButton.unlock();
        }
    }

    async function selectEmojiAsync() {
        await withEmojiSelection((e) => {
            game.emote(client.localUser, e);
            footbar.setEmojiButton(settings.inputBinding.keyButtonEmote, e);
        });
    }

    function setAudioProperties() {
        client.setAudioProperties(
            window.location.origin,
            0.125,
            settings.audioDistanceMin = game.audioDistanceMin = options.audioDistanceMin,
            settings.audioDistanceMax = game.audioDistanceMax = options.audioDistanceMax,
            settings.audioRolloff = options.audioRolloff);
    }

    function refreshGamepads() {
        options.gamepads = navigator.getGamepads();
        options.gamepadIndex = game.gamepadIndex;
    }

    window.addEventListeners({
        resize: () => {
            game.resize();
        },
        gamepadconnected: refreshGamepads,
        gamepaddisconnected: refreshGamepads
    });

    headbar.addEventListeners({
        toggleOptions: () => {
            if (!emoji.isOpen()) {
                login.hide();
                options.toggleOpen();
            }
        },
        toggleInstructions: () => {
            if (!emoji.isOpen()) {
                options.hide();
                login.toggleOpen();
            }
        },
        tweet: () => {
            const message = encodeURIComponent(`Join my #TeleParty ${document.location.href}`),
                url = new URL("https://twitter.com/intent/tweet?text=" + message);
            open(url);
        },
        leave: () => {
            client.leave();
        }
    });

    footbar.addEventListeners({
        selectEmoji: selectEmojiAsync,
        emote: () => {
            game.emote(client.localUser, game.currentEmoji);
        },
        toggleAudio: () => {
            client.toggleAudioAsync();
        },
        toggleVideo: () => {
            client.toggleVideoAsync();
        }
    });


    login.addEventListener("login", () => {
        client.startAudio();
        client.joinAsync(
            host,
            settings.roomName = login.roomName,
            settings.userName = login.userName);
    });


    options.addEventListeners({
        selectAvatar: async () => {
            withEmojiSelection((e) => {
                settings.avatarEmoji
                    = options.avatarEmoji
                    = game.me.avatarEmoji
                    = e;
                client.setAvatarEmoji(e);
            });
        },
        avatarURLChanged: () => {
            client.setAvatarURL(options.avatarURL);
        },
        audioPropertiesChanged: setAudioProperties,
        toggleVideo: () => {
            client.toggleVideoAsync();
        },
        toggleDrawHearing: () => {
            settings.drawHearing = game.drawHearing = options.drawHearing;
        },
        fontSizeChanged: () => {
            settings.fontSize = game.fontSize = options.fontSize;
        },
        audioInputChanged: () => {
            client.setAudioInputDeviceAsync(options.currentAudioInputDevice);
        },
        audioOutputChanged: () => {
            client.setAudioOutputDevice(options.currentAudioOutputDevice);
        },
        videoInputChanged: () => {
            client.setVideoInputDeviceAsync(options.currentVideoInputDevice);
        },
        gamepadChanged: () => {
            settings.gamepadIndex = game.gamepadIndex = options.gamepadIndex;
        },
        inputBindingChanged: () => {
            settings.inputBinding = game.inputBinding = options.inputBinding;
        }
    });

    game.addEventListeners({
        emote: (evt) => {
            client.emote(evt.emoji);
        },
        userJoined: (evt) => {
            evt.user.addEventListener("userPositionNeeded", (evt2) => {
                client.userInitRequest(evt2.id);
            });
        },
        toggleAudio: () => {
            client.toggleAudioAsync();
        },
        toggleVideo: () => {
            client.toggleVideoAsync();
        },
        gameStarted: () => {
            login.hide();
            headbar.enabled = true;
            footbar.enabled = true;

            setAudioProperties();

            client.setLocalPosition(game.me);
            game.me.addEventListener("userMoved", (evt) => {
                client.setLocalPosition(evt);
            });

            if (settings.avatarEmoji !== null) {
                game.me.avatarEmoji = settings.avatarEmoji
            }
            settings.avatarEmoji
                = options.avatarEmoji
                = game.me.avatarEmoji;
        },
        gameEnded: () => {
            game.hide();
            login.connected = false;
            showLogin();
        },
        emojiNeeded: selectEmojiAsync,
        zoomChanged: () => {
            settings.zoom = game.targetCameraZ;
        }
    });

    client.addEventListeners({
        videoConferenceJoined: async (evt) => {
            login.connected = true;

            window.location.hash = login.roomName;

            game.start(evt);

            options.audioInputDevices = await client.getAudioInputDevicesAsync();
            options.audioOutputDevices = await client.getAudioOutputDevicesAsync();
            options.videoInputDevices = await client.getVideoInputDevicesAsync();

            options.currentAudioInputDevice = await client.getCurrentAudioInputDeviceAsync();
            options.currentAudioOutputDevice = await client.getCurrentAudioOutputDeviceAsync();
            options.currentVideoInputDevice = await client.getCurrentVideoInputDeviceAsync();

            const audioMuted = await client.isAudioMutedAsync();
            game.muteUserAudio({ id: client.localUser, muted: audioMuted });
            footbar.audioEnabled = !audioMuted;

            const videoMuted = await client.isVideoMutedAsync();
            game.muteUserVideo({ id: client.localUser, muted: videoMuted });
            options.videoEnabled = !videoMuted;
        },
        videoConferenceLeft: (evt) => {
            if (evt.roomName.toLowerCase() === game.currentRoomName) {
                game.end();
            }
        },
        participantJoined: (evt) => {
            game.addUser(evt);
        },
        videoAdded: (evt) => {
            game.setAvatarVideo(evt);
        },
        videoRemoved: (evt) => {
            game.setAvatarVideo(evt);
        },
        participantLeft: (evt) => {
            game.removeUser(evt);
            client.removeUser(evt);
        },
        avatarChanged: (evt) => {
            game.setAvatarURL(evt);
            if (evt.id === client.localUser) {
                options.avatarURL = evt.avatarURL;
            }
        },
        displayNameChange: (evt) => {
            game.changeUserName(evt);
        },
        audioMuteStatusChanged: (evt) => {
            game.muteUserAudio(evt);
        },
        localAudioMuteStatusChanged: async (evt) => {
            footbar.audioEnabled = !evt.muted;
            if (!evt.muted) {
                options.currentAudioInputDevice = await client.getCurrentAudioInputDeviceAsync();
            }
        },
        videoMuteStatusChanged: (evt) => {
            game.muteUserVideo(evt);
        },
        localVideoMuteStatusChanged: async (evt) => {
            options.videoEnabled = !evt.muted;
            footbar.videoEnabled = !evt.muted;
            if (!evt.muted) {
                options.currentVideoInputDevice = await client.getCurrentVideoInputDeviceAsync();
            }
            else {
                options.currentVideoInputDevice = null;
            }
        },
        userInitRequest: (evt) => {
            if (game.me && game.me.id) {
                client.userInitResponse(evt.id, game.me.serialize());
            }
            else {
                console.log("Local user not initialized");
            }
        },
        userInitResponse: (evt) => {
            if (game.users.has(evt.id)) {
                const user = game.users.get(evt.id);
                user.deserialize(evt);
                client.setUserPosition(evt);
            }
        },
        userMoved: (evt) => {
            if (game.users.has(evt.id)) {
                const user = game.users.get(evt.id);
                user.moveTo(evt.x, evt.y);
                client.setUserPosition(evt);
            }
        },
        emote: (evt) => {
            game.emote(evt.id, evt);
        },
        setAvatarEmoji: (evt) => {
            game.setAvatarEmoji(evt);
        },
        audioActivity: (evt) => {
            game.updateAudioActivity(evt);
        }
    });

    login.ready = true;
    return forExport;
}