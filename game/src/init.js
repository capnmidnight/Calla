import { addEventListeners, CallaClient } from "../../js/src/index.js";
import { allPeople as people } from "./emoji/emojis.js";
import { EmojiForm } from "./forms/EmojiForm.js";
import { FooterBar } from "./forms/FooterBar.js";
import { FormDialog } from "./forms/FormDialog.js";
import { HeaderBar } from "./forms/HeaderBar.js";
import { LoginForm } from "./forms/LoginForm.js";
import { OptionsForm } from "./forms/OptionsForm.js";
import { UserDirectoryForm } from "./forms/UserDirectoryForm.js";
import { Game } from "./Game.js";
import { disabled } from "./html/attrs.js";
import { gridPos, gridRowsDef } from "./html/grid.js";
import { hide, isOpen, setOpen, show } from "./html/ops.js";
import { Settings } from "./Settings.js";
import { RequestAnimationFrameTimer } from "./timers/RequestAnimationFrameTimer.js";

const disabler = disabled(true),
    enabler = disabled(false);

/**
 * @param {string} JITSI_HOST
 * @param {string} JVB_HOST
 * @param {string} JVB_MUC
 */
export function init(JITSI_HOST, JVB_HOST, JVB_MUC) {
    const settings = new Settings(),
        game = new Game(),
        login = new LoginForm(),
        directory = new UserDirectoryForm(),
        headbar = new HeaderBar(),
        footbar = new FooterBar(),
        options = new OptionsForm(),
        emoji = new EmojiForm(),
        client = new CallaClient(JITSI_HOST, JVB_HOST, JVB_MUC),
        timer = new RequestAnimationFrameTimer(),

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
        hide(game);
        hide(directory);
        hide(options);
        hide(emoji);
        headbar.enabled = false;
        footbar.enabled = false;
        show(login);
    }

    async function withEmojiSelection(callback) {
        if (!isOpen(emoji)) {
            disabler.apply(headbar.optionsButton);
            disabler.apply(headbar.instructionsButton);
            hide(options);
            const e = await emoji.selectAsync();
            if (e) {
                callback(e);
            }
            enabler.apply(headbar.optionsButton);
            enabler.apply(headbar.instructionsButton);
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

    function refreshUser(userID) {
        game.withUser("list user in directory", userID, (user) => directory.set(user));
    }

    gridRowsDef("auto", "1fr", "auto").apply(document.body);

    let z = 0;
    for (let e of forAppend) {
        if (e.element) {
            let g = null;
            if (e === headbar) {
                g = gridPos(1, 1);
            }
            else if (e === footbar) {
                g = gridPos(1, 3);
            }
            else if (e === game || e === login) {
                g = gridPos(1, 1, 1, 3);
            }
            else {
                g = gridPos(1, 2);
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

    client.audio
        .addClip("join", "audio/door-open.ogg", "audio/door-open.mp3", "audio/door-open.wav")
        .addClip("leave", "audio/door-close.ogg", "audio/door-close.mp3", "audio/door-close.wav");

    showLogin();

    addEventListeners(window, {
        gamepadconnected: refreshGamepads,
        gamepaddisconnected: refreshGamepads,

        resize: () => {
            game.resize();
        }
    });

    /**
     * @callback showViewCallback
     * @returns {void}
     */

    /**
     * @param {FormDialog} view
     * @returns {showViewCallback}
     */
    const showView = (view) => () => {
        if (!isOpen(emoji)) {
            const open = isOpen(view);
            hide(login);
            hide(directory);
            hide(options);
            setOpen(view, !open);
        }
    };

    addEventListeners(headbar, {
        toggleOptions: showView(options),
        toggleInstructions: showView(login),
        toggleUserDirectory: showView(directory),

        tweet: () => {
            const message = encodeURIComponent(`Join my #TeleParty ${document.location.href}`),
                url = new URL("https://twitter.com/intent/tweet?text=" + message);
            window.open(url);
        },

        leave: async () => {
            directory.clear();
            await client.leaveAsync();
        }
    });

    addEventListeners(footbar, {
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


    login.addEventListener("login", () => {
        client.startAudio();
        setAudioProperties();
        if (window.location.hostname !== "localhost") {
            window.history.replaceState(undefined, undefined, "#" + login.roomName);
        }

        client.join(
            settings.roomName = login.roomName,
            settings.userName = login.userName);
    });


    addEventListeners(options, {
        audioPropertiesChanged: setAudioProperties,

        selectAvatar: async () => {
            await withEmojiSelection((e) => {
                settings.avatarEmoji
                    = client.avatarEmoji
                    = game.me.avatarEmoji
                    = e;
                refreshUser(client.localUser);
            });
        },

        avatarURLChanged: () => {
            settings.avatarURL
                = client.avatarURL
                = game.me.avatarImage
                = options.avatarURL;
            refreshUser(client.localUser);
        },

        toggleDrawHearing: () => {
            settings.drawHearing
                = game.drawHearing
                = options.drawHearing;
        },

        fontSizeChanged: () => {
            settings.fontSize
                = game.fontSize
                = options.fontSize;
        },

        gamepadChanged: () => {
            settings.gamepadIndex
                = game.gamepadIndex
                = options.gamepadIndex;
        },

        inputBindingChanged: () => {
            settings.inputBinding
                = game.inputBinding
                = options.inputBinding;
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

        toggleVideo: async () => {
            await client.toggleVideoMutedAsync();
        }
    });

    addEventListeners(game, {
        emojiNeeded: selectEmojiAsync,

        emote: (evt) => {
            client.emote(evt.emoji);
        },

        userJoined: (evt) => {
            refreshUser(evt.user.id);
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
            gridPos(1, 2).apply(login.element);
            hide(login);

            options.user = game.me;

            headbar.enabled = true;
            footbar.enabled = true;

            settings.avatarEmoji
                = client.avatarEmoji
                = game.me.avatarEmoji
                = settings.avatarEmoji
                || people.random();

            refreshUser(client.localUser);
        },

        userMoved: (evt) => {
            client.setLocalPosition(evt.x, 0, evt.y);
        },

        gameEnded: () => {
            gridPos(1, 1, 1, 3).apply(login.element);
            login.connected = false;
            showLogin();
        },

        zoomChanged: () => {
            settings.zoom = game.targetCameraZ;
        }
    });

    directory.addEventListener("warpTo", (evt) => {
        game.visit(evt.id);
    });

    addEventListeners(client, {

        videoConferenceJoined: async (evt) => {
            login.connected = true;

            await game.startAsync(evt.id, evt.displayName, evt.pose, evt.avatarURL, evt.roomName);

            client.avatarURL
                = game.me.avatarImage
                = options.avatarURL
                = settings.avatarURL;

            options.audioInputDevices = await client.getAudioInputDevicesAsync();
            options.audioOutputDevices = await client.getAudioOutputDevicesAsync();
            options.videoInputDevices = await client.getVideoInputDevicesAsync();

            settings.preferredAudioInputID = client.preferredAudioInputID;
            settings.preferredAudioOutputID = client.preferredAudioOutputID;
            settings.preferredVideoInputID = client.preferredVideoInputID;

            options.currentAudioInputDevice = await client.getCurrentAudioInputDeviceAsync();
            options.currentAudioOutputDevice = await client.getCurrentAudioOutputDeviceAsync();
            options.currentVideoInputDevice = await client.getCurrentVideoInputDeviceAsync();

            const audioMuted = client.isAudioMuted;
            game.muteUserAudio(client.localUser, audioMuted);
            footbar.audioEnabled = !audioMuted;

            const videoMuted = client.isVideoMuted;
            game.muteUserVideo(client.localUser, videoMuted);
            footbar.videoEnabled = !videoMuted;
        },

        videoConferenceLeft: () => {
            game.end();
        },

        participantJoined: (evt) => {
            client.audio.playClip("join", 0.5);
            game.addUser(evt.id, evt.displayName, evt.pose);
        },

        participantLeft: (evt) => {
            client.audio.playClip("leave", 0.5);
            game.removeUser(evt.id);
            directory.delete(evt.id);
        },

        audioChanged: (evt) => {
            refreshUser(evt.id);
        },

        videoChanged: (evt) => {
            game.setAvatarVideo(evt.id, evt.stream);
            refreshUser(evt.id);
        },

        avatarChanged: (evt) => {
            game.setAvatarURL(evt.id, evt.url);
            refreshUser(evt.id);
        },

        displayNameChange: (evt) => {
            game.changeUserName(evt.id, evt.displayName);
            refreshUser(evt.id);
        },

        audioMuteStatusChanged: async (evt) => {
            game.muteUserAudio(evt.id, evt.muted);
        },

        localAudioMuteStatusChanged: async (evt) => {
            footbar.audioEnabled = !evt.muted;
            options.currentAudioInputDevice = await client.getCurrentAudioInputDeviceAsync();
            settings.preferredAudioInputID = client.preferredAudioInputID;
        },

        videoMuteStatusChanged: async (evt) => {
            game.muteUserVideo(evt.id, evt.muted);
            settings.preferredVideoInputID = client.preferredVideoInputID;
        },

        localVideoMuteStatusChanged: async (evt) => {
            footbar.videoEnabled = !evt.muted;
            if (evt.muted) {
                options.setAvatarVideo(null);
            }
            else {
                options.setAvatarVideo(game.me.avatarVideo.element);
            }
            options.currentVideoInputDevice = await client.getCurrentVideoInputDeviceAsync();
        },

        userInitRequest: (evt) => {
            client.userInitResponse(evt.id, game.me.serialize());
        },

        userInitResponse: (evt) => {
            game.initializeUser(evt.id, evt);
            refreshUser(evt.id);
        },

        emote: (evt) => {
            game.emote(evt.id, evt);
        },

        setAvatarEmoji: (evt) => {
            game.setAvatarEmoji(evt.id, evt);
            refreshUser(evt.id);
        },

        audioActivity: (evt) => {
            game.updateAudioActivity(evt.id, evt.isActive);
        }
    });

    timer.addEventListener("tick", (evt) => {
        client.audio.update();
        options.update();
        directory.update();
        game.update(evt.dt);
    });

    login.ready = true;
    timer.start();

    return forExport;
}