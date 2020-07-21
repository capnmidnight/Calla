import { versionString } from "./version.js";
console.log(`${versionString}`);
/** @type {Element} */
const versionContainer = document.querySelector("#login h1");
if (versionContainer) {
    versionContainer.replaceChild(
        document.createTextNode(versionString),
        versionContainer.childNodes[0]);
    versionContainer.childNodes[1].style.display = "inline-block";
}


import { EmojiForm } from "./forms/EmojiForm.js";
import { FooterBar } from "./forms/FooterBar.js";
import { HeaderBar } from "./forms/HeaderBar.js";
import { LoginForm } from "./forms/LoginForm.js";
import { OptionsForm } from "./forms/OptionsForm.js";
import { UserDirectoryForm } from "./forms/UserDirectoryForm.js";
import { Game } from "./Game.js";
import { grid } from "./html/attrs.js";
import { BaseJitsiClient } from "./jitsi/BaseJitsiClient.js";
import { Settings } from "./Settings.js";
import { SFX } from "./audio/SFX.js";



/**
 * 
 * @param {BaseJitsiClient} client
 */
export function init(client) {
    const settings = new Settings(),
        sound = new SFX()
            .add("join", "/audio/door-open.ogg", "/audio/door-open.mp3", "/audio/door-open.wav")
            .add("leave", "/audio/door-close.ogg", "/audio/door-close.mp3", "/audio/door-close.wav"),
        game = new Game(),
        login = new LoginForm(),
        directory = new UserDirectoryForm(),
        headbar = new HeaderBar(),
        footbar = new FooterBar(),
        options = new OptionsForm(),
        emoji = new EmojiForm(),

        forExport = {
            settings,
            client,
            game,
            login,
            directory,
            headbar,
            footbar,
            options,
            emoji
        },

        forAppend = [
            game,
            directory,
            options,
            emoji,
            headbar,
            footbar,
            login
        ].filter(x => x.element);

    function showLogin() {
        game.hide();
        directory.hide();
        options.hide();
        emoji.hide();
        headbar.enabled = false;
        footbar.enabled = false;
        login.show();
    }

    async function withEmojiSelection(callback) {
        if (!emoji.isOpen) {
            headbar.optionsButton.lock();
            headbar.instructionsButton.lock();
            options.hide();
            const e = await emoji.selectAsync();
            if (e) {
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
            settings.audioDistanceMin = game.audioDistanceMin = options.audioDistanceMin,
            settings.audioDistanceMax = game.audioDistanceMax = options.audioDistanceMax,
            settings.audioRolloff = options.audioRolloff,
            settings.transitionSpeed);
    }

    function refreshGamepads() {
        options.gamepads = navigator.getGamepads();
        options.gamepadIndex = game.gamepadIndex;
    }

    function refreshUser(userID, isNew) {
        if (game.users.has(userID)) {
            const user = game.users.get(userID);
            directory.set(user, isNew);
        }
    }

    document.body.style.display = "grid";
    document.body.style.gridTemplateRows = "auto 1fr auto";
    let z = 0;
    for (let e of forAppend) {
        if (e.element) {
            let g = null;
            if (e === headbar) {
                g = grid(1, 1);
            }
            else if (e === footbar) {
                g = grid(1, 3);
            }
            else if (e === game || e === login) {
                g = grid(1, 1, 1, 3);
            }
            else {
                g = grid(1, 2);
            }
            g.apply(e.element);
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
    game.transitionSpeed = settings.transitionSpeed = 0.5;
    login.userName = settings.userName;
    login.roomName = settings.roomName;

    client.preferredAudioOutputID = settings.preferredAudioOutputID;
    client.preferredAudioInputID = settings.preferredAudioInputID;
    client.preferredVideoInputID = settings.preferredVideoInputID;

    showLogin();

    window.addEventListeners({
        gamepadconnected: refreshGamepads,
        gamepaddisconnected: refreshGamepads,

        resize: () => {
            game.resize();
        }
    });

    const showView = (view) => () => {
        if (!emoji.isOpen) {
            const isOpen = view.isOpen;
            login.hide();
            directory.hide();
            options.hide();
            view.isOpen = !isOpen;
        }
    };

    headbar.addEventListeners({
        toggleOptions: showView(options),
        toggleInstructions: showView(login),
        toggleUserDirectory: showView(directory),

        toggleFullscreen: () => {
            headbar.isFullscreen = !headbar.isFullscreen;
        },

        tweet: () => {
            const message = encodeURIComponent(`Join my #TeleParty ${document.location.href}`),
                url = new URL("https://twitter.com/intent/tweet?text=" + message);
            open(url);
        },

        leave: () => {
            directory.clear();
            client.leave();
        }
    });

    footbar.addEventListeners({
        selectEmoji: selectEmojiAsync,

        emote: () => {
            game.emote(client.localUser, game.currentEmoji);
        },

        toggleAudio: async () => {
            await client.toggleAudioMutedAsync();
        },

        toggleVideo: async () => {
            await client.toggleVideoMutedAsync();
        }
    });


    login.addEventListener("login", async () => {
        client.startAudio();

        const joinInfo = await client.joinAsync(
            settings.roomName = login.roomName,
            settings.userName = login.userName);

        login.connected = true;

        window.location.hash = login.roomName;

        await game.startAsync(joinInfo);

        options.audioInputDevices = await client.getAudioInputDevicesAsync();
        options.audioOutputDevices = await client.getAudioOutputDevicesAsync();
        options.videoInputDevices = await client.getVideoInputDevicesAsync();

        options.currentAudioInputDevice = await client.getCurrentAudioInputDeviceAsync();
        options.currentAudioOutputDevice = await client.getCurrentAudioOutputDeviceAsync();
        options.currentVideoInputDevice = await client.getCurrentVideoInputDeviceAsync();

        const audioMuted = client.isAudioMuted;
        game.muteUserAudio({ id: client.localUser, muted: audioMuted });
        footbar.audioEnabled = !audioMuted;

        const videoMuted = client.isVideoMuted;
        game.muteUserVideo({ id: client.localUser, muted: videoMuted });
        footbar.videoEnabled = !videoMuted;
    });


    options.addEventListeners({
        audioPropertiesChanged: setAudioProperties,

        selectAvatar: async () => {
            await withEmojiSelection((e) => {
                settings.avatarEmoji
                    = options.avatarEmoji
                    = e;
                game.me.setAvatarEmoji(e);
                client.setAvatarEmoji(e);
            });
        },

        avatarURLChanged: () => {
            client.setAvatarURL(options.avatarURL);
        },

        toggleDrawHearing: () => {
            settings.drawHearing = game.drawHearing = options.drawHearing;
        },

        fontSizeChanged: () => {
            settings.fontSize = game.fontSize = options.fontSize;
        },

        audioInputChanged: async () => {
            const device = options.currentAudioInputDevice;
            await client.setAudioInputDeviceAsync(device);
            settings.preferredAudioInputID = client.preferredAudioInputID;
        },

        audioOutputChanged: async () => {
            const device = options.currentAudioOutputDevice;
            await client.setAudioOutputDeviceAsync(device);
            settings.preferredAudioOutputID = client.preferredAudioOutputID;
        },

        videoInputChanged: async () => {
            const device = options.currentVideoInputDevice;
            await client.setVideoInputDeviceAsync(device);
            settings.preferredVideoInputID = client.preferredVideoInputID;
        },

        gamepadChanged: () => {
            settings.gamepadIndex = game.gamepadIndex = options.gamepadIndex;
        },

        inputBindingChanged: () => {
            settings.inputBinding = game.inputBinding = options.inputBinding;
        }
    });

    game.addEventListeners({
        emojiNeeded: selectEmojiAsync,

        emote: (evt) => {
            client.emote(evt.emoji);
        },

        userJoined: (evt) => {
            evt.user.addEventListener("userPositionNeeded", (evt2) => {
                client.userInitRequest(evt2.id);
            });
            refreshUser(evt.user.id, true);
        },

        toggleAudio: async () => {
            await client.toggleAudioMutedAsync();
            settings.preferredAudioInputID = client.preferredAudioInputID;
        },

        toggleVideo: async () => {
            await client.toggleVideoMutedAsync();
            settings.preferredVideoInputID = client.preferredVideoInputID;
        },

        gameStarted: () => {
            grid(1, 2).apply(login.element);
            login.hide();
            headbar.enabled = true;
            footbar.enabled = true;

            setAudioProperties();

            client.setLocalPosition(game.me.position.x, game.me.position.y);
            game.me.addEventListener("userMoved", (evt) => {
                client.setLocalPosition(evt.x, evt.y);
                refreshUser(game.me.id);
            });

            if (settings.avatarEmoji !== null) {
                game.me.setAvatarEmoji(settings.avatarEmoji);
            }

            settings.avatarEmoji
                = options.avatarEmoji
                = game.me.avatarEmoji;

            refreshUser(game.me.id);
        },

        gameEnded: () => {
            grid(1, 1, 1, 3).apply(login.element);
            game.hide();
            login.connected = false;
            showLogin();
        },

        zoomChanged: () => {
            settings.zoom = game.targetCameraZ;
        }
    });

    directory.addEventListener("warpTo", (evt) => {
        if (game.users.has(evt.id)) {
            const user = game.users.get(evt.id);
            game.warpMeTo(user.position._tx, user.position._ty);
            directory.hide();
        }
    });

    client.addEventListeners({

        videoConferenceLeft: (evt) => {
            game.end();
        },

        participantJoined: (evt) => {
            sound.play("join", 0.5);
            game.addUser(evt);
        },

        videoAdded: (evt) => {
            game.setAvatarVideo(evt.id, evt.stream);
            refreshUser(evt.id);
        },

        videoRemoved: (evt) => {
            game.setAvatarVideo(evt.id, null);
            refreshUser(evt.id);
        },

        participantLeft: (evt) => {
            sound.play("leave", 0.5);
            game.removeUser(evt);
            client.removeUser(evt);
            directory.delete(evt.id);
        },

        avatarChanged: (evt) => {
            game.setAvatarURL(evt);
            if (evt.id === client.localUser) {
                options.avatarURL = evt.avatarURL;
            }
            refreshUser(evt.id);
        },

        displayNameChange: (evt) => {
            game.changeUserName(evt);
            refreshUser(evt.id);
        },

        audioMuteStatusChanged: async (evt) => {
            game.muteUserAudio(evt);
            if (evt.id === client.localUser) {
                footbar.audioEnabled = !evt.muted;
                options.currentAudioInputDevice = await client.getCurrentAudioInputDeviceAsync();
            }
        },

        videoMuteStatusChanged: async (evt) => {
            game.muteUserVideo(evt);
            if (evt.id === client.localUser) {
                footbar.videoEnabled = !evt.muted;
                options.currentVideoInputDevice = await client.getCurrentVideoInputDeviceAsync();
            }
        },

        userInitRequest: (evt) => {
            if (game.me && game.me.id) {
                client.userInitResponse(evt.id, game.me.serialize());
            }
            else {
                directory.warn("Local user not initialized");
            }
        },

        userInitResponse: (evt) => {
            if (game.users.has(evt.id)) {
                const user = game.users.get(evt.id);
                user.deserialize(evt);
                client.setUserPosition(evt.id, evt.x, evt.y);
                refreshUser(evt.id);
            }
        },

        userMoved: (evt) => {
            if (game.users.has(evt.id)) {
                const user = game.users.get(evt.id);
                user.moveTo(evt.x, evt.y, settings.transitionSpeed);
                client.setUserPosition(evt.id, evt.x, evt.y);
            }
            refreshUser(evt.id);
        },

        emote: (evt) => {
            game.emote(evt.id, evt);
        },

        setAvatarEmoji: (evt) => {
            game.setAvatarEmoji(evt);
            refreshUser(evt.id);
        },

        audioActivity: (evt) => {
            game.updateAudioActivity(evt);
        }
    });

    login.ready = true;

    return forExport;
}