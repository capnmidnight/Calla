import { CallaClient } from "../calla/CallaClient";
import { addEventListeners } from "../calla/events/addEventListeners";
import { JITSI_HOST, JVB_HOST, JVB_MUC } from "../constants";
import { allPeople as people } from "../emoji/emojis";
import { disabled } from "../html/attrs";
import { hide, isOpen, show } from "../html/ops";
import { RequestAnimationFrameTimer } from "../timers/RequestAnimationFrameTimer";
import { ButtonLayer } from "./forms/ButtonLayer";
import { DevicesDialog } from "./forms/DevicesDialog";
import { EmojiForm } from "./forms/EmojiForm";
import { FormDialog } from "./forms/FormDialog";
import { LoginForm } from "./forms/LoginForm";
import { OptionsForm } from "./forms/OptionsForm";
import { UserDirectoryForm } from "./forms/UserDirectoryForm";
import { Game } from "./Game";
import { loadFont } from "./graphics/loadFont";
import { Settings } from "./Settings";

const CAMERA_ZOOM_MIN = 0.5,
    CAMERA_ZOOM_MAX = 20,
    settings = new Settings(),
    game = new Game(CAMERA_ZOOM_MIN, CAMERA_ZOOM_MAX),
    login = new LoginForm(),
    directory = new UserDirectoryForm(),
    controls = new ButtonLayer(game.element, CAMERA_ZOOM_MIN, CAMERA_ZOOM_MAX),
    devices = new DevicesDialog(),
    options = new OptionsForm(),
    instructions = new FormDialog("instructions"),
    emoji = new EmojiForm(),
    client = new CallaClient(JITSI_HOST, JVB_HOST, JVB_MUC),
    timer = new RequestAnimationFrameTimer(),
    disabler = disabled(true),
    enabler = disabled(false);

let waitingForEmoji = false;

Object.assign(window, {
    settings,
    client,
    game,
    login,
    directory,
    controls,
    devices,
    options,
    emoji,
    instructions
});

async function postObj(path, obj) {
    const request = fetch(path, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(obj)
    });

    const response = await request;
    if (response.ok) {
        console.log("Thanks!");
    }

    return response;
}

async function recordJoin(Name, Email, Room) {
    await postObj("/Contacts", { Name, Email, Room });
}

async function recordRoom(roomName) {
    const response = await postObj("/Game/Rooms", roomName);
    const shortName = await response.text();
    return shortName;
}


/**
 * @callback showViewCallback
 * @returns {void}
 */

/**
 * @param {FormDialog} view
 * @returns {showViewCallback}
 */
const _showView = (view) =>
    () => showView(view);

function showView(view) {
    if (!waitingForEmoji) {
        hide(login);
        hide(directory);
        hide(options);
        hide(devices);
        hide(emoji);
        hide(instructions);
        show(view);
    }
}

async function withEmojiSelection(callback) {
    if (!isOpen(emoji)) {
        waitingForEmoji = true;
        disabler.apply(controls.optionsButton);
        disabler.apply(controls.instructionsButton);
        disabler.apply(controls.changeDevicesButton);
        hide(options);
        const e = await emoji.selectAsync();
        if (e) {
            callback(e);
        }
        enabler.apply(controls.optionsButton);
        enabler.apply(controls.instructionsButton);
        enabler.apply(controls.changeDevicesButton);
        waitingForEmoji = false;
    }
}

async function selectEmojiAsync() {
    await withEmojiSelection((e) => {
        game.emote(client.localUserID, e);
        controls.setEmojiButton(settings.inputBinding.keyButtonEmote, e);
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

addEventListeners(window, {
    gamepadconnected: refreshGamepads,
    gamepaddisconnected: refreshGamepads,

    resize: () => {
        game.resize();
    }
});

addEventListeners(controls, {
    toggleOptions: _showView(options),
    toggleInstructions: _showView(instructions),
    toggleUserDirectory: _showView(directory),
    changeDevices: _showView(devices),

    tweet: () => {
        const message = encodeURIComponent(`Join my #TeleParty ${document.location.href}`),
            url = new URL("https://twitter.com/intent/tweet?text=" + message);
        window.open(url);
    },

    leave: async () => {
        directory.clear();
        await client.leaveAsync();
    },

    selectEmoji: selectEmojiAsync,

    emote: () => {
        game.emote(client.localUserID, game.currentEmoji);
    },

    toggleAudio: async () => {
        await client.toggleAudioMutedAsync();
    },

    toggleVideo: async () => {
        await client.toggleVideoMutedAsync();
    },

    zoomChanged: () => {
        settings.zoom = game.zoom = controls.zoom;
    }
});

addEventListeners(login, {
    login: async () => {
        client.startAudio();
        await client.audio.createClip("join", false, false, true, null, "audio/door-open.ogg", "audio/door-open.mp3", "audio/door-open.wav");
        await client.audio.createClip("leave", false, false, true, null, "audio/door-close.ogg", "audio/door-close.mp3", "audio/door-close.wav");
        setAudioProperties();

        let roomName = login.roomName;
        if (!login.roomSelectMode) {
            roomName = await recordRoom(roomName);
        }

        await recordJoin(
            settings.userName = login.userName,
            settings.email = login.email,
            settings.roomName = roomName);

        const title = `Calla - chatting in ${roomName}`;
        const path = `${window.location.pathname}#${roomName}`;
        window.history.replaceState({}, title, path);

        await directory.startAsync(roomName, login.userName);
        await client.join(roomName, login.userName);
    }
});

addEventListeners(options, {
    audioPropertiesChanged: setAudioProperties,

    selectAvatar: async () => {
        await withEmojiSelection((e) => {
            settings.avatarEmoji
                = client.avatarEmoji
                = game.me.avatarEmoji
                = e;
            refreshUser(client.localUserID);
        });
    },

    avatarURLChanged: () => {
        settings.avatarURL
            = client.avatarURL
            = game.me.avatarImage
            = options.avatarURL;
        refreshUser(client.localUserID);
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

    toggleVideo: async () => {
        await client.toggleVideoMutedAsync();
    }
});

addEventListeners(devices, {

    audioInputChanged: async () => {
        const device = devices.currentAudioInputDevice;
        await client.setAudioInputDeviceAsync(device);
        settings.preferredAudioInputID = client.preferredAudioInputID;
    },

    audioOutputChanged: async () => {
        const device = devices.currentAudioOutputDevice;
        await client.setAudioOutputDeviceAsync(device);
        settings.preferredAudioOutputID = client.preferredAudioOutputID;
    },

    videoInputChanged: async () => {
        const device = devices.currentVideoInputDevice;
        await client.setVideoInputDeviceAsync(device);
        settings.preferredVideoInputID = client.preferredVideoInputID;
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
        game.resize();
        hide(login);
        show(controls);

        options.user = game.me;

        controls.enabled = true;

        settings.avatarEmoji
            = client.avatarEmoji
            = game.me.avatarEmoji
            = settings.avatarEmoji
            || people.random();

        refreshUser(client.localUserID);
    },

    userMoved: (evt) => {
        client.setLocalPosition(evt.x, 0, evt.y);
    },

    gameEnded: () => {
        login.connected = false;
        showView(login);
    },

    zoomChanged: () => {
        settings.zoom = controls.zoom = game.zoom;
    }
});

addEventListeners(directory, {
    warpTo: (evt) => {
        game.visit(evt.id);
    },
    chatFocusChanged: () => {
        game.keyboardEnabled = !directory.chatFocused;
    }
});

addEventListeners(client, {

    videoConferenceJoined: async (evt) => {
        login.connected = true;

        await game.startAsync(evt.id, evt.displayName, evt.pose, evt.avatarURL, evt.roomName);

        client.avatarURL
            = game.me.avatarImage
            = options.avatarURL
            = settings.avatarURL;

        devices.audioInputDevices = await client.getAudioInputDevicesAsync();
        devices.audioOutputDevices = await client.getAudioOutputDevicesAsync();
        devices.videoInputDevices = await client.getVideoInputDevicesAsync();

        settings.preferredAudioInputID = client.preferredAudioInputID;
        settings.preferredAudioOutputID = client.preferredAudioOutputID;
        settings.preferredVideoInputID = client.preferredVideoInputID;

        devices.currentAudioInputDevice = await client.getCurrentAudioInputDeviceAsync();
        devices.currentAudioOutputDevice = await client.getCurrentAudioOutputDeviceAsync();
        devices.currentVideoInputDevice = await client.getCurrentVideoInputDeviceAsync();

        const audioMuted = client.isAudioMuted;
        game.muteUserAudio(client.localUserID, audioMuted);
        controls.audioEnabled = !audioMuted;

        const videoMuted = client.isVideoMuted;
        game.muteUserVideo(client.localUserID, videoMuted);
        controls.videoEnabled = !videoMuted;
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
        controls.audioEnabled = !evt.muted;
        devices.currentAudioInputDevice = await client.getCurrentAudioInputDeviceAsync();
        settings.preferredAudioInputID = client.preferredAudioInputID;
    },

    videoMuteStatusChanged: async (evt) => {
        game.muteUserVideo(evt.id, evt.muted);
        settings.preferredVideoInputID = client.preferredVideoInputID;
    },

    localVideoMuteStatusChanged: async (evt) => {
        controls.videoEnabled = !evt.muted;
        if (evt.muted) {
            options.setAvatarVideo(null);
        }
        else {
            options.setAvatarVideo(game.me.avatarVideo.element);
        }
        devices.currentVideoInputDevice = await client.getCurrentVideoInputDeviceAsync();
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

addEventListeners(timer, {
    tick: (evt) => {
        client.update();
        options.update();
        directory.update();
        game.update(evt.dt);
    }
});

options.drawHearing = game.drawHearing = settings.drawHearing;
options.audioDistanceMin = game.audioDistanceMin = settings.audioDistanceMin;
options.audioDistanceMax = game.audioDistanceMax = settings.audioDistanceMax;
options.audioRolloff = settings.audioRolloff;
options.fontSize = game.fontSize = settings.fontSize;
options.gamepads = navigator.getGamepads();
options.gamepadIndex = game.gamepadIndex = settings.gamepadIndex;
options.inputBinding = game.inputBinding = settings.inputBinding;

controls.zoom = game.zoom = settings.zoom;
game.cameraZ = game.targetCameraZ;
game.transitionSpeed = settings.transitionSpeed = 0.5;
login.userName = settings.userName;
login.roomName = settings.roomName;
login.email = settings.email;

controls.enabled = false;
showView(login);

login.ready = true;
timer.start();

loadFont("Noto Color Emoji");