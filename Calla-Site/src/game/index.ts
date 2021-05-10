import { AudioManager, SpatializerType } from "calla/audio/AudioManager";
import { JitsiOnlyClientLoader } from "calla/client-loader/JitsiOnlyClientLoader";
import { Emoji } from "kudzu/emoji/Emoji";
import { allPeopleGroup as people } from "kudzu/emoji/people";
import { once } from "kudzu/events/once";
import { loadFont, makeFont } from "kudzu/graphics2d/fonts";
import { disabled } from "kudzu/html/attrs";
import { Fetcher } from "kudzu/io/Fetcher";
import { TimerTickEvent } from "kudzu/timers/BaseTimer";
import { RequestAnimationFrameTimer } from "kudzu/timers/RequestAnimationFrameTimer";
import { audioClips, emojiFont, JITSI_HOST, JVB_HOST, JVB_MUC, rooms } from "../configuration";
import { ButtonLayer } from "./forms/ButtonLayer";
import { DevicesDialog } from "./forms/DevicesDialog";
import { EmojiForm } from "./forms/EmojiForm";
import { FormDialog } from "./forms/FormDialog";
import { InstructionsForm } from "./forms/InstructionsDialog";
import { LoginForm } from "./forms/LoginForm";
import { hide, isOpen, show } from "./forms/ops";
import { OptionsForm } from "./forms/OptionsForm";
import { UserDirectoryForm } from "./forms/UserDirectoryForm";
import { Game } from "./Game";
import { Settings } from "./Settings";

(async function () {

    async function recordJoin(Name: string, Email: string, Room: string) {
        await fetcher.postObject("/Contacts", { Name, Email, Room }, "application/json");
    }

    async function recordRoom(roomName: string) {
        return await fetcher.postObjectForText("/Game/Rooms", roomName, "application/json");
    }

    function _showView(view: FormDialog<any>) {
        return () => showView(view);
    }

    function showView(view: FormDialog<any>) {
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

    async function withEmojiSelection(callback: (e: Emoji) => any) {
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

    function refreshUser(userID: string) {
        game.withUser("list user in directory", userID, (user) => directory.set(user));
    }

    async function selectEmojiAsync() {
        await withEmojiSelection((e) => {
            game.emote(client.localUserID, e);
            controls.setEmojiButton(e);
        });
    }

    function setAudioProperties() {
        audio.setAudioProperties(
            settings.audioDistanceMin = game.audioDistanceMin = options.audioDistanceMin,
            settings.audioDistanceMax = game.audioDistanceMax = options.audioDistanceMax,
            settings.audioRolloff = options.audioRolloff,
            audio.algorithm,
            settings.transitionSpeed);
    }

    const CAMERA_ZOOM_MIN = 0.5,
        CAMERA_ZOOM_MAX = 20,
        settings = new Settings(),
        fetcher = new Fetcher(),
        audio = new AudioManager(fetcher, SpatializerType.High),
        loader = new JitsiOnlyClientLoader(JITSI_HOST, JVB_HOST, JVB_MUC),
        game = new Game(fetcher, CAMERA_ZOOM_MIN, CAMERA_ZOOM_MAX),
        login = new LoginForm(rooms),
        directory = new UserDirectoryForm(),
        controls = new ButtonLayer(CAMERA_ZOOM_MIN, CAMERA_ZOOM_MAX),
        devices = new DevicesDialog(),
        options = new OptionsForm(),
        instructions = new InstructionsForm(),
        emoji = new EmojiForm(),
        timer = new RequestAnimationFrameTimer(),
        disabler = disabled(true),
        enabler = disabled(false),
        client = await loader.load(fetcher, audio),
        rawGameStartEmoji = new Emoji(null, ""),
        rawEmoteEmoji = new Emoji(null, ""),
        rawAvatarEmoji = new Emoji(null, "");

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

    document.body.append(
        controls.element,
        game.element,
        login.element,
        directory.element,
        controls.element,
        devices.element,
        options.element,
        emoji.element,
        instructions.element
    );

    window.addEventListener("gamepadconnected", refreshGamepads);
    window.addEventListener("gamepaddisconnected", refreshGamepads);
    window.addEventListener("resize", () => game.resize());

    controls.addEventListener("toggleOptions", _showView(options));
    controls.addEventListener("toggleInstructions", _showView(instructions));
    controls.addEventListener("toggleUserDirectory", _showView(directory));
    controls.addEventListener("changeDevices", _showView(devices));

    controls.addEventListener("tweet", () => {
        const message = encodeURIComponent(`Join my #TeleParty ${document.location.href}`),
            url = "https://twitter.com/intent/tweet?text=" + message;
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

        if (!audio.ready) {
            await once(audio, "audioready");
            setAudioProperties();
        }

        let roomName = await recordRoom(login.roomName);

        await recordJoin(
            settings.userName = login.userName,
            settings.email = login.email,
            settings.roomName = roomName);


        const title = `Calla - chatting in ${roomName}`;
        const path = `${window.location.pathname}#${roomName}`;
        window.history.replaceState({}, title, path);

        await directory.startAsync(roomName, login.userName);
        await client.join(roomName);
        await client.identify(login.userName);
    });

    options.addEventListener("audioPropertiesChanged", setAudioProperties);

    options.addEventListener("selectAvatar", async () => {
        await withEmojiSelection((e) => {
            settings.avatarEmoji = e.value;
            client.setAvatarEmoji(e.value);
            game.me.setAvatarEmoji(e.value);
            refreshUser(client.localUserID);
        });
    });

    options.addEventListener("avatarURLChanged", () => {
        settings.avatarURL = options.avatarURL;
        client.setAvatarURL(options.avatarURL);
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
        await client.setAudioInputDevice(device);
        settings.preferredAudioInputID = client.preferredAudioInputID;
    });

    devices.addEventListener("audioOutputChanged", async () => {
        const device = devices.currentAudioOutputDevice;
        await client.setAudioOutputDevice(device);
        settings.preferredAudioOutputID = client.preferredAudioOutputID;
    });

    devices.addEventListener("videoInputChanged", async () => {
        const device = devices.currentVideoInputDevice;
        await client.setVideoInputDevice(device);
        settings.preferredVideoInputID = client.preferredVideoInputID;
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
        settings.preferredAudioInputID = client.preferredAudioInputID;
    });

    game.addEventListener("toggleVideo", async () => {
        await client.toggleVideoMuted();
        settings.preferredVideoInputID = client.preferredVideoInputID;
    });

    game.addEventListener("gameStarted", () => {
        game.resize();
        hide(login);
        show(controls);

        options.user = game.me;

        controls.enabled = true;

        settings.avatarEmoji = settings.avatarEmoji || people.random().value;
        rawGameStartEmoji.value = settings.avatarEmoji;
        client.setAvatarEmoji(settings.avatarEmoji);
        game.me.setAvatarEmoji(settings.avatarEmoji);

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

        await game.startAsync(evt.id, login.userName, evt.pose, null, login.roomName);

        options.avatarURL = settings.avatarURL;
        client.setAvatarURL(settings.avatarURL);
        game.me.setAvatarImage(settings.avatarURL);

        devices.audioInputDevices = await client.getAudioInputDevices(true);
        devices.audioOutputDevices = await client.getAudioOutputDevices(true);
        devices.videoInputDevices = await client.getVideoInputDevices(true);

        settings.preferredAudioInputID = client.preferredAudioInputID;
        settings.preferredAudioOutputID = client.preferredAudioOutputID;
        settings.preferredVideoInputID = client.preferredVideoInputID;

        devices.currentAudioInputDevice = await client.getCurrentAudioInputDevice();
        devices.currentAudioOutputDevice = await client.getCurrentAudioOutputDevice();
        devices.currentVideoInputDevice = await client.getCurrentVideoInputDevice();

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

    client.addEventListener("participantJoined", (evt) => {
        game.addUser(evt.id, evt.displayName, evt.source.pose);
        audio.playClip("join");
    });

    client.addEventListener("participantLeft", (evt) => {
        audio.playClip("leave");
        game.removeUser(evt.id);
        directory.delete(evt.id);
    });

    client.addEventListener("audioAdded", (evt) => refreshUser(evt.id));

    client.addEventListener("audioRemoved", (evt) => refreshUser(evt.id));

    client.addEventListener("videoAdded", (evt) => {
        game.setAvatarVideo(evt.id, evt.stream);
        refreshUser(evt.id);
    });

    client.addEventListener("videoRemoved", (evt) => {
        game.setAvatarVideo(evt.id, null);
        refreshUser(evt.id);
    });

    client.addEventListener("avatarChanged", (evt) => {
        game.setAvatarURL(evt.id, evt.url);
        refreshUser(evt.id);
    });

    client.addEventListener("userNameChanged", (evt) => {
        game.changeUserName(evt.id, evt.displayName);
        refreshUser(evt.id);
    });

    client.addEventListener("audioMuteStatusChanged", async (evt) => {
        if (evt.id === client.localUserID) {
            controls.audioEnabled = !evt.muted;
            devices.currentAudioInputDevice = await client.getCurrentAudioInputDevice();
            settings.preferredAudioInputID = client.preferredAudioInputID;
        }
        game.muteUserAudio(evt.id, evt.muted);
    });

    client.addEventListener("videoMuteStatusChanged", async (evt) => {
        if (evt.id === client.localUserID) {
            controls.videoEnabled = !evt.muted;
            if (evt.muted) {
                options.setAvatarVideo(null);
            }
            else {
                options.setAvatarVideo(game.me.avatarVideo.element);
            }
            devices.currentVideoInputDevice = await client.getCurrentVideoInputDevice();
        }
        game.muteUserVideo(evt.id, evt.muted);
        settings.preferredVideoInputID = client.preferredVideoInputID;
    });

    client.addEventListener("emote", (evt) => {
        rawEmoteEmoji.value = evt.emoji;
        game.emote(evt.id, rawEmoteEmoji);
    });

    client.addEventListener("setAvatarEmoji", (evt) => {
        rawAvatarEmoji.value = evt.emoji;
        game.setAvatarEmoji(evt.id, rawAvatarEmoji);
        refreshUser(evt.id);
    });

    client.addEventListener("audioActivity", (evt) => {
        game.updateAudioActivity(evt.id, evt.isActive);
    });

    timer.addEventListener("tick", (evt: TimerTickEvent) => {
        audio.update();
        options.update();
        directory.update();
        game.update(evt.dt);
    });

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

    await client.getMediaPermissions();

    login.ready = true;
    timer.start();
})();