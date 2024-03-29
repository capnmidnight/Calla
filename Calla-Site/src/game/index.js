import { AudioManager, SpatializerType } from "calla/audio/AudioManager";
import { JitsiOnlyClientLoader } from "calla/client-loader/JitsiOnlyClientLoader";
import { Logger } from "kudzu/debugging/Logger";
import { Emoji } from "kudzu/emoji/Emoji";
import { allPeopleGroup as people } from "kudzu/emoji/people";
import { once } from "kudzu/events/once";
import { sleep } from "kudzu/events/sleep";
import { loadFont, makeFont } from "kudzu/graphics2d/fonts";
import { disabled } from "kudzu/html/attrs";
import { Fetcher } from "kudzu/io/Fetcher";
import { RequestAnimationFrameTimer } from "kudzu/timers/RequestAnimationFrameTimer";
import { audioClips, emojiFont, JITSI_HOST, JVB_HOST, JVB_MUC, rooms } from "../configuration";
import { AvatarMode } from "./avatars/AvatarMode";
import { ButtonLayer } from "./forms/ButtonLayer";
import { DevicesDialog } from "./forms/DevicesDialog";
import { EmojiForm } from "./forms/EmojiForm";
import { InstructionsForm } from "./forms/InstructionsDialog";
import { LoginForm } from "./forms/LoginForm";
import { hide, isOpen, show } from "./forms/ops";
import { OptionsForm } from "./forms/OptionsForm";
import { UserDirectoryForm } from "./forms/UserDirectoryForm";
import { Game } from "./Game";
import { Settings } from "./Settings";
(async function () {
    async function recordJoin(Name, Email, Room) {
        await fetcher.postObject("/Contacts", { Name, Email, Room }, "application/json");
    }
    async function recordRoom(roomName) {
        return await fetcher.postObjectForText("/Game/Rooms", roomName, "application/json");
    }
    function _showView(view) {
        return () => showView(view);
    }
    function showView(view) {
        if (!waitingForEmoji) {
            hide(login);
            hide(directory);
            hide(options);
            hide(devices);
            hide(emoji);
            hide(instructions);
            if (view === login) {
                hide(controls);
            }
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
    function refreshGamepads() {
        options.gamepads = navigator.getGamepads();
        options.gamepadIndex = game.gamepadIndex;
    }
    function refreshUser(userID) {
        game.withUser("list user in directory", userID, (user) => directory.set(user));
    }
    async function selectEmojiAsync() {
        await withEmojiSelection((e) => {
            game.emote(client.localUserID, e);
            controls.setEmojiButton(e);
        });
    }
    function setAudioProperties() {
        audio.setAudioProperties(settings.audioDistanceMin = game.audioDistanceMin = options.audioDistanceMin, settings.audioDistanceMax = game.audioDistanceMax = options.audioDistanceMax, settings.audioRolloff = options.audioRolloff, audio.algorithm, settings.transitionSpeed);
    }
    const CAMERA_ZOOM_MIN = 0.5, CAMERA_ZOOM_MAX = 20, logger = new Logger(), settings = new Settings(), fetcher = new Fetcher(), audio = new AudioManager(fetcher, SpatializerType.High), loader = new JitsiOnlyClientLoader(JITSI_HOST, JVB_HOST, JVB_MUC), game = new Game(fetcher, CAMERA_ZOOM_MIN, CAMERA_ZOOM_MAX), login = new LoginForm(rooms), directory = new UserDirectoryForm(), controls = new ButtonLayer(CAMERA_ZOOM_MIN, CAMERA_ZOOM_MAX), devices = new DevicesDialog(), options = new OptionsForm(), instructions = new InstructionsForm(), emoji = new EmojiForm(), timer = new RequestAnimationFrameTimer(), disabler = disabled(true), enabler = disabled(false), client = await loader.load(fetcher, audio), rawGameStartEmoji = new Emoji(null, ""), rawEmoteEmoji = new Emoji(null, ""), rawAvatarEmoji = new Emoji(null, "");
    let waitingForEmoji = false;
    Object.assign(window, {
        settings,
        fetcher,
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
    document.body.append(controls.element, game.element, login.element, directory.element, controls.element, devices.element, options.element, emoji.element, instructions.element);
    window.addEventListener("gamepadconnected", refreshGamepads);
    window.addEventListener("gamepaddisconnected", refreshGamepads);
    window.addEventListener("resize", () => game.resize());
    controls.addEventListener("toggleOptions", _showView(options));
    controls.addEventListener("toggleInstructions", _showView(instructions));
    controls.addEventListener("toggleUserDirectory", _showView(directory));
    controls.addEventListener("changeDevices", _showView(devices));
    controls.addEventListener("tweet", () => {
        const message = encodeURIComponent(`Join my #TeleParty ${document.location.href}`), url = "https://twitter.com/intent/tweet?text=" + message;
        window.open(url);
    });
    controls.addEventListener("leave", async () => {
        directory.clear();
        await client.leave();
    });
    controls.addEventListener("selectEmoji", selectEmojiAsync);
    controls.addEventListener("emote", () => {
        game.emote(client.localUserID, game.currentEmoji);
    });
    controls.addEventListener("toggleAudio", async () => {
        await client.toggleAudioMuted();
    });
    controls.addEventListener("toggleVideo", async () => {
        await client.toggleVideoMuted();
    });
    controls.addEventListener("zoomChanged", () => {
        settings.zoom = game.zoom = controls.zoom;
    });
    login.addEventListener("login", async () => {
        if (!audio.isReady) {
            await once(audio, "audioready");
            setAudioProperties();
        }
        let roomName = await recordRoom(login.roomName);
        await recordJoin(settings.userName = login.userName, settings.email = login.email, settings.roomName = roomName);
        const title = `Calla - chatting in ${roomName}`;
        const path = `${window.location.pathname}#${roomName}`;
        window.history.replaceState({}, title, path);
        await directory.startAsync(roomName, login.userName);
        await client.join(roomName, true);
        await client.identify(login.userName);
    });
    options.addEventListener("audioPropertiesChanged", setAudioProperties);
    options.addEventListener("selectAvatar", async () => {
        await withEmojiSelection((e) => {
            settings.avatarEmoji = e.value;
            for (const [toUserID, _] of client.getUserNames()) {
                client.setAvatarEmoji(toUserID, e.value);
            }
            game.me.setAvatarEmoji(e.value);
            refreshUser(client.localUserID);
        });
    });
    options.addEventListener("avatarURLChanged", () => {
        settings.avatarURL = options.avatarURL;
        for (const [toUserID, _] of client.getUserNames()) {
            client.setAvatarURL(toUserID, options.avatarURL);
        }
        game.me.setAvatarImage(options.avatarURL);
        refreshUser(client.localUserID);
    });
    options.addEventListener("toggleDrawHearing", () => {
        settings.drawHearing
            = game.drawHearing
                = options.drawHearing;
    });
    options.addEventListener("fontSizeChanged", () => {
        settings.fontSize
            = game.fontSize
                = options.fontSize;
    });
    options.addEventListener("gamepadChanged", () => {
        settings.gamepadIndex
            = game.gamepadIndex
                = options.gamepadIndex;
    });
    options.addEventListener("inputBindingChanged", () => {
        settings.inputBinding
            = game.inputBinding
                = options.inputBinding;
    });
    options.addEventListener("toggleVideo", async () => {
        await client.toggleVideoMuted();
    });
    devices.addEventListener("audioInputChanged", async () => {
        const device = devices.currentAudioInputDevice;
        await client.devices.setAudioInputDevice(device);
        settings.preferredAudioInputID = client.devices.preferredAudioInputID;
    });
    devices.addEventListener("audioOutputChanged", async () => {
        const device = devices.currentAudioOutputDevice;
        await client.setAudioOutputDevice(device);
        settings.preferredAudioOutputID = client.devices.preferredAudioOutputID;
    });
    devices.addEventListener("videoInputChanged", async () => {
        const device = devices.currentVideoInputDevice;
        await client.devices.setVideoInputDevice(device);
        settings.preferredVideoInputID = client.devices.preferredVideoInputID;
    });
    game.addEventListener("emojiNeeded", selectEmojiAsync);
    game.addEventListener("emote", (evt) => {
        client.emote(evt.emoji);
    });
    game.addEventListener("userJoined", (evt) => {
        refreshUser(evt.user.id);
    });
    game.addEventListener("toggleAudio", async () => {
        await client.toggleAudioMuted();
        settings.preferredAudioInputID = client.devices.preferredAudioInputID;
    });
    game.addEventListener("toggleVideo", async () => {
        await client.toggleVideoMuted();
        settings.preferredVideoInputID = client.devices.preferredVideoInputID;
    });
    game.addEventListener("gameStarted", () => {
        game.resize();
        hide(login);
        show(controls);
        options.user = game.me;
        controls.enabled = true;
        refreshUser(client.localUserID);
    });
    game.addEventListener("userMoved", (evt) => {
        client.setLocalPose(evt.x, 0, evt.y, 0, 0, -1, 0, 1, 0);
    });
    game.addEventListener("gameEnded", () => {
        login.connected = false;
        showView(login);
    });
    game.addEventListener("zoomChanged", () => {
        settings.zoom = controls.zoom = game.zoom;
    });
    directory.addEventListener("warpTo", (evt) => {
        game.visit(evt.id);
    });
    client.addEventListener("conferenceJoined", async (evt) => {
        login.connected = true;
        await game.startAsync(evt.userID, login.userName, evt.pose, login.roomName);
        game.me.setAvatarEmoji(settings.avatarEmoji);
        game.me.setAvatarImage(settings.avatarURL);
        devices.audioInputDevices = await client.devices.getAudioInputDevices(true);
        devices.audioOutputDevices = await client.devices.getAudioOutputDevices(true);
        devices.videoInputDevices = await client.devices.getVideoInputDevices(true);
        settings.preferredAudioInputID = client.devices.preferredAudioInputID;
        settings.preferredAudioOutputID = client.devices.preferredAudioOutputID;
        settings.preferredVideoInputID = client.devices.preferredVideoInputID;
        devices.currentAudioInputDevice = await client.devices.getAudioInputDevice();
        devices.currentAudioOutputDevice = await client.devices.getAudioOutputDevice();
        devices.currentVideoInputDevice = await client.devices.getVideoInputDevice();
        const audioMuted = client.isAudioMuted;
        game.muteUserAudio(client.localUserID, audioMuted);
        controls.audioEnabled = !audioMuted;
        const videoMuted = client.isVideoMuted;
        game.muteUserVideo(client.localUserID, videoMuted);
        controls.videoEnabled = !videoMuted;
    });
    client.addEventListener("conferenceLeft", () => {
        game.end();
    });
    client.addEventListener("participantJoined", async (evt) => {
        game.addUser(evt.userID, evt.displayName, evt.source.pose);
        await sleep(250);
        if (game.me.avatarMode === AvatarMode.Emoji) {
            client.setAvatarEmoji(evt.userID, game.me.avatarEmoji.value);
            await sleep(250);
        }
        else if (game.me.avatarMode === AvatarMode.Photo) {
            client.setAvatarURL(evt.userID, game.me.avatarImage.url);
            await sleep(250);
        }
        const { p, f, u } = game.me.pose.end;
        client.tellLocalPose(evt.userID, p[0], p[1], p[2], f[0], f[1], f[2], u[0], u[1], u[2]);
        audio.playClip("join");
    });
    client.addEventListener("participantLeft", (evt) => {
        audio.playClip("leave");
        game.removeUser(evt.userID);
        directory.delete(evt.userID);
    });
    client.addEventListener("audioAdded", (evt) => refreshUser(evt.userID));
    client.addEventListener("audioRemoved", (evt) => refreshUser(evt.userID));
    client.addEventListener("videoAdded", (evt) => {
        game.setAvatarVideo(evt.userID, evt.stream);
        refreshUser(evt.userID);
    });
    client.addEventListener("videoRemoved", (evt) => {
        game.setAvatarVideo(evt.userID, null);
        refreshUser(evt.userID);
    });
    client.addEventListener("userNameChanged", (evt) => {
        game.changeUserName(evt.userID, evt.displayName);
        refreshUser(evt.userID);
    });
    client.addEventListener("audioMuteStatusChanged", async (evt) => {
        if (evt.userID === client.localUserID) {
            controls.audioEnabled = !evt.muted;
            devices.currentAudioInputDevice = await client.devices.getAudioInputDevice();
            settings.preferredAudioInputID = client.devices.preferredAudioInputID;
        }
        game.muteUserAudio(evt.userID, evt.muted);
    });
    client.addEventListener("videoMuteStatusChanged", async (evt) => {
        if (evt.userID === client.localUserID) {
            controls.videoEnabled = !evt.muted;
            if (evt.muted) {
                options.setAvatarVideo(null);
            }
            else {
                options.setAvatarVideo(game.me.avatarVideo.element);
            }
            devices.currentVideoInputDevice = await client.devices.getVideoInputDevice();
        }
        game.muteUserVideo(evt.userID, evt.muted);
        settings.preferredVideoInputID = client.devices.preferredVideoInputID;
    });
    client.addEventListener("emote", (evt) => {
        rawEmoteEmoji.value = evt.emoji;
        game.emote(evt.userID, rawEmoteEmoji);
    });
    client.addEventListener("setAvatarEmoji", (evt) => {
        rawAvatarEmoji.value = evt.emoji;
        game.setAvatarEmoji(evt.userID, rawAvatarEmoji);
        refreshUser(evt.userID);
    });
    client.addEventListener("setAvatarURL", (evt) => {
        logger.log("got setAvatarURL:" + evt.userID, evt.url);
        game.setAvatarURL(evt.userID, evt.url);
        refreshUser(evt.userID);
    });
    client.addEventListener("audioActivity", (evt) => {
        game.updateAudioActivity(evt.id, evt.isActive);
    });
    timer.addEventListener("tick", (evt) => {
        audio.update();
        options.update();
        directory.update();
        game.update(evt.dt);
    });
    settings.avatarEmoji = settings.avatarEmoji || people.random().value;
    rawGameStartEmoji.value = settings.avatarEmoji;
    options.avatarURL = settings.avatarURL;
    options.drawHearing = game.drawHearing = settings.drawHearing;
    options.audioDistanceMin = game.audioDistanceMin = settings.audioDistanceMin;
    options.audioDistanceMax = game.audioDistanceMax = settings.audioDistanceMax;
    options.audioRolloff = settings.audioRolloff;
    options.fontSize = game.fontSize = settings.fontSize;
    options.gamepadIndex = game.gamepadIndex = settings.gamepadIndex;
    options.inputBinding = game.inputBinding = settings.inputBinding;
    options.gamepads = navigator.getGamepads();
    controls.zoom = game.zoom = settings.zoom;
    game.cameraZ = game.targetCameraZ;
    game.transitionSpeed = settings.transitionSpeed = 0.5;
    login.userName = settings.userName;
    login.roomName = settings.roomName;
    login.email = settings.email;
    showView(login);
    await Promise.all([
        loadFont(makeFont(emojiFont)),
        audio.createClip("join", false, false, false, 0.5, audioClips.join),
        audio.createClip("leave", false, false, true, 0.5, audioClips.leave),
        client.connect()
    ]);
    await client.devices.getMediaPermissions();
    login.ready = true;
    timer.start();
})();
//# sourceMappingURL=index.js.map