import { EmojiForm } from "./emojiForm.js";
import { bust } from "./emoji.js";
import { isGoodNumber } from "./math.js";
import { option } from "./html.js";
import "./protos.js";

export class AppGui extends EventTarget {
    constructor(game) {
        super();

        this.game = game;
        this.jitsiClient = game.jitsiClient;
        this.optionsView = null;
        this.emoteButton = null;
        this.muteAudioButton = null;

        // >>>>>>>>>> TWEET >>>>>>>>>>
        {
            const tweetButton = document.querySelector("#tweet");
            if (tweetButton) {
                tweetButton.addEventListener("click", (evt) => {
                    const message = encodeURIComponent(`Join my #TeleParty ${document.location.href}`),
                        url = new URL("https://twitter.com/intent/tweet?text=" + message);
                    open(url);
                });
            }
        }
        // <<<<<<<<<< TWEET <<<<<<<<<<

        // >>>>>>>>>> ZOOM >>>>>>>>>>
        {
            this.zoomSpinner = document.querySelector("#zoom");
            if (this.zoomSpinner) {
                this.zoomSpinner.addEventListener("input", (evt) => {
                    this.game.targetCameraZ = this.zoomSpinner.value;
                });
                this.zoomSpinner.value = this.game.targetCameraZ;
            }
        }
        // <<<<<<<<<< ZOOM <<<<<<<<<<

        // >>>>>>>>>> EMOJI >>>>>>>>>>
        {
            this.emojiForm = new EmojiForm(document.querySelector("#emoji"));
            this.emoteButton = document.querySelector("#emote")

            const selectEmojiButton = document.querySelector("#selectEmoji");

            if (this.emoteButton
                && selectEmojiButton) {

                this.emoteButton.addEventListener("click", () => this.game.emote());

                selectEmojiButton.addEventListener("click", async (evt) => {
                    if ((!this.optionsView || !this.optionsView.isOpen())
                        && (!this.loginView || !this.loginView.isOpen())) {
                        const emoji = await this.emojiForm.selectAsync();
                        if (!!emoji) {
                            this.game.emote(this.game.me.id, emoji);
                        }
                    }
                });
            }
        }
        // <<<<<<<<<< EMOJI <<<<<<<<<<

        // >>>>>>>>>> OPTIONS >>>>>>>>>>
        {
            this.optionsView = document.querySelector("#options");
            const optionsButton = document.querySelector("#showOptions"),
                optionsConfirmButton = document.querySelector("#options button.confirm");
            if (this.optionsView
                && optionsButton
                && optionsConfirmButton) {

                const toggleOptionsView = () => {
                    this.optionsView.setOpenWithLabel(
                        !this.optionsView.isOpen(),
                        optionsButton,
                        "Hide", "Show", " options");
                };

                optionsButton.addEventListener("click", (evt) => {
                    if (!this.emojiForm.isOpen()
                        && (!this.loginView || !this.loginView.isOpen())) {
                        toggleOptionsView();
                        if (this.optionsView.isOpen()) {
                            this.dispatchEvent(new Event("optionsOpened"));
                        }
                    }
                });

                optionsConfirmButton.addEventListener("click", (evt) => {
                    if (this.optionsView.isOpen()) {
                        toggleOptionsView();
                        this.dispatchEvent(new Event("optionsConfirmed"));
                    }
                });

                this.optionsView.show();
                toggleOptionsView();

                // >>>>>>>>>> AVATAR >>>>>>>>>>
                {
                    const avatarURLInput = document.querySelector("#avatarURL"),
                        avatarEmojiOutput = document.querySelector("#avatarEmoji"),
                        selectAvatarEmojiButton = document.querySelector("#selectAvatarEmoji");
                    if (avatarURLInput
                        && avatarEmojiOutput
                        && selectAvatarEmojiButton) {

                        selectAvatarEmojiButton.addEventListener("click", async (evt) => {
                            const emoji = await this.emojiForm.selectAsync()
                                || bust;
                            avatarEmojiOutput.innerHTML = emoji.value;
                        });

                        this.addEventListener("optionsOpened", (evt) => {
                            avatarURLInput.value = this.game.me && this.game.me.avatarURL
                                || "";
                            avatarEmojiOutput.innerHTML = this.game.me && this.game.me.avatarEmoji
                                || bust.value;
                        });

                        this.addEventListener("optionsConfirmed", (evt) => {
                            if (!!this.game.me) {
                                if (this.game.me.avatarURL !== avatarURLInput.value) {
                                    this.jitsiClient.setAvatarURL(avatarURLInput.value);
                                }
                                if (this.game.me.avatarEmoji !== avatarEmojiOutput.innerHTML) {
                                    this.game.me.avatarEmoji = avatarEmojiOutput.innerHTML;
                                    const evt = Object.assign({}, this.me);
                                    for (let user of this.game.userList) {
                                        if (!user.isMe) {
                                            this.jitsiClient.sendUserState(user.id, evt);
                                        }
                                    }
                                }
                            }
                        });
                    }
                }
                // <<<<<<<<<< AVATAR <<<<<<<<<<

                // >>>>>>>>>> FONT SIZE >>>>>>>>>>
                {
                    const fontSizeSpinner = document.querySelector("#fontSize");
                    if (fontSizeSpinner) {
                        fontSizeSpinner.addEventListener("input", (evt) => {
                            const size = fontSizeSpinner.value;
                            this.game.fontSize = size;
                            localStorage.setItem("fontSize", size);
                        });
                        fontSizeSpinner.value = localStorage.getInt("fontSize", 10);
                        this.game.fontSize = fontSizeSpinner.value;
                    }
                }
                // <<<<<<<<<< FONT SIZE <<<<<<<<<<

                // >>>>>>>>>> KEYBOARD >>>>>>>>>>
                {
                    const keyButtonUp = document.querySelector("#keyButtonUp"),
                        keyButtonDown = document.querySelector("#keyButtonDown"),
                        keyButtonLeft = document.querySelector("#keyButtonLeft"),
                        keyButtonRight = document.querySelector("#keyButtonRight"),
                        keyButtonEmote = document.querySelector("#keyButtonEmote"),
                        keyButtonToggleAudio = document.querySelector("#keyButtonToggleAudio");
                    if (keyButtonUp
                        && keyButtonDown
                        && keyButtonLeft
                        && keyButtonRight
                        && keyButtonEmote
                        && keyButtonToggleAudio) {

                        const setKeyOption = (key, get, set) => {
                            set(localStorage.getItem(key.id) || get());

                            key.addEventListener("keyup", (evt) => {
                                if (document.activeElement === key) {
                                    key.value = evt.key;
                                }
                            });

                            key.value = get();

                            this.addEventListener("optionsConfirmed", (evt) => {
                                set(key.value);
                                localStorage.setItem(key.id, key.value);
                            });
                        };

                        setKeyOption(keyButtonUp, () => this.game.keyUp, v => this.game.keyUp = v);
                        setKeyOption(keyButtonDown, () => this.game.keyDown, v => this.game.keyDown = v);
                        setKeyOption(keyButtonLeft, () => this.game.keyLeft, v => this.game.keyLeft = v);
                        setKeyOption(keyButtonRight, () => this.game.keyRight, v => this.game.keyRight = v);
                        setKeyOption(keyButtonEmote, () => this.game.keyEmote, v => {
                            this.game.keyEmote = v;
                            this.refreshEmojiButton();
                        });
                        setKeyOption(keyButtonToggleAudio, () => this.game.keyToggleAudio, v => {
                            this.game.keyToggleAudio = v;
                            if (!!this.game.me) {
                                this.setUserAudioMuted(this.game.me.audioMuted);
                            }
                        });
                    }
                }
                // <<<<<<<<<< KEYBOARD <<<<<<<<<<

                // >>>>>>>>>> GAMEPAD >>>>>>>>>>
                {
                    const gamepadSelector = document.querySelector("#gamepads"),
                        gpButtonUp = document.querySelector("#gpButtonUp"),
                        gpButtonDown = document.querySelector("#gpButtonDown"),
                        gpButtonLeft = document.querySelector("#gpButtonLeft"),
                        gpButtonRight = document.querySelector("#gpButtonRight"),
                        gpButtonEmote = document.querySelector("#gpButtonEmote"),
                        gpButtonToggleAudio = document.querySelector("#gpButtonToggleAudio");
                    if (gamepadSelector
                        && gpButtonUp
                        && gpButtonDown
                        && gpButtonLeft
                        && gpButtonRight
                        && gpButtonEmote
                        && gpButtonToggleAudio) {

                        const refreshGamepadList = (evt) => {
                            gamepadSelector.innerHTML = "";
                            if (this.game.gamepads.length === 0) {
                                gamepadSelector.appendChild(option("No gamepads detected"));
                                gamepadSelector.lock();
                            }
                            else {
                                gamepadSelector.unlock();
                                this.game.gamepads.map((pad, i) => option({
                                    selected: i === this.game.gamepadIndex
                                }, pad.id))
                                    .forEach(opt => gamepadSelector.appendChild(opt));
                            }
                        };

                        this.addEventListener("optionsOpened", refreshGamepadList);
                        addEventListener("gamepadconnected", refreshGamepadList);
                        addEventListener("gamepaddisconnected", refreshGamepadList);

                        gamepadSelector.addEventListener("input", (evt) => {
                            this.game.gamepadIndex = gamepadSelector.selectedIndex;
                        });

                        const setGPOption = (btn, get, set) => {
                            set(localStorage.getInt(btn.id, get()));

                            this.game.addEventListener("gamepadButtonPressed", (evt) => {
                                if (document.activeElement === btn) {
                                    btn.value = evt.button;
                                }
                            });

                            btn.addEventListener("input", (evt) => {
                                btn.value = get();
                            });

                            const refresh = (evt) => {
                                btn.value = get();

                                if (this.game.gamepads.length === 0) {
                                    btn.lock();
                                }
                                else {
                                    btn.unlock();
                                }
                            };

                            this.addEventListener("optionsOpened", refresh);
                            addEventListener("gamepadconnected", refresh);
                            addEventListener("gamepaddisconnected", refresh);

                            this.addEventListener("optionsConfirmed", (evt) => {
                                const value = parseInt(btn.value, 10);
                                if (isGoodNumber(value)) {
                                    set(value);
                                    localStorage.setItem(btn.id, value);
                                }
                            });
                        };

                        setGPOption(gpButtonUp, () => this.game.buttonUp, v => this.game.buttonUp = v);
                        setGPOption(gpButtonDown, () => this.game.buttonDown, v => this.game.buttonDown = v);
                        setGPOption(gpButtonLeft, () => this.game.buttonLeft, v => this.game.buttonLeft = v);
                        setGPOption(gpButtonRight, () => this.game.buttonRight, v => this.game.buttonRight = v);
                        setGPOption(gpButtonEmote, () => this.game.buttonEmote, v => this.game.buttonEmote = v);
                        setGPOption(gpButtonToggleAudio, () => this.game.buttonToggleAudio, v => this.game.buttonToggleAudio = v);
                    }
                }
                // <<<<<<<<<< GAMEPAD <<<<<<<<<<

                // >>>>>>>>>> AUDIO >>>>>>>>>>
                {
                    const audioInputDeviceSelector = document.querySelector("#audioInputDevices"),
                        audioOutputDeviceSelector = document.querySelector("#audioOutputDevices"),
                        drawHearingCheckbox = document.querySelector("#drawHearing"),
                        minAudioSpinner = document.querySelector("#minAudio"),
                        maxAudioSpinner = document.querySelector("#maxAudio"),
                        rolloffSpinner = document.querySelector("#rolloff");

                    this.muteAudioButton = document.querySelector("#muteAudio");
                    this.drawHearing = localStorage.getItem("drawHearing") === "true";

                    this.audioDistanceMin = localStorage.getInt("minAudio", 2);
                    this.audioDistanceMin = Math.max(1, this.audioDistanceMin);
                    this.audioDistanceMax = localStorage.getInt("maxAudio", 10);
                    this.audioDistanceMax = Math.max(this.audioDistanceMin + 1, this.audioDistanceMax);
                    this.rolloff = localStorage.getInt("rolloff", 50) / 10;
                    this.rolloff = Math.max(0.1, Math.min(10, this.rolloff));

                    if (audioInputDeviceSelector
                        && audioOutputDeviceSelector
                        && drawHearingCheckbox
                        && minAudioSpinner
                        && maxAudioSpinner
                        && this.muteAudioButton) {

                        let lastAudioInputDevice = null,
                            audioInputDevices = null;

                        this.addEventListener("optionsOpened", async (evt) => {
                            lastAudioInputDevice = await this.jitsiClient.getCurrentAudioInputDevice();
                            audioInputDevices = await this.jitsiClient.getAudioInputDevices();
                            audioInputDeviceSelector.innerHTML = "";
                            if (audioInputDevices.length === 0) {
                                audioInputDeviceSelector.lock();
                                audioInputDeviceSelector.appendChild(option("No audio input devices available"));
                            }
                            else {
                                audioInputDeviceSelector.unlock();
                                audioInputDevices.map(a =>
                                    option(a.label, {
                                        selected: !!lastAudioInputDevice && a.id === lastAudioInputDevice.id
                                    }))
                                    .forEach(opt => audioInputDeviceSelector.appendChild(opt));
                            }
                        });

                        audioInputDeviceSelector.addEventListener("input", (evt) => {
                            if (audioInputDevices) {
                                const audioInputDevice = audioInputDevices[audioInputDeviceSelector.selectedIndex];

                                if (audioInputDevice !== lastAudioInputDevice) {
                                    this.jitsiClient.setAudioInputDevice(audioInputDevice);
                                    lastAudioInputDevice = audioInputDevice;
                                }
                            }
                        });

                        let lastAudioOutputDevice = null,
                            audioOutputDevices = null

                        this.addEventListener("optionsOpened", async (evt) => {
                            lastAudioOutputDevice = await this.jitsiClient.getCurrentAudioInputDevice();
                            audioOutputDevices = await this.jitsiClient.getAudioOutputDevices();
                            audioOutputDeviceSelector.innerHTML = "";
                            if (audioOutputDevices.length === 0) {
                                audioOutputDeviceSelector.lock();
                                audioOutputDeviceSelector.appendChild(option("No audio output devices available"));
                            }
                            else {
                                audioOutputDeviceSelector.unlock();
                                audioOutputDevices.map(a => option(a.label, {
                                    selected: !!lastAudioOutputDevice && a.id === lastAudioOutputDevice.id
                                }))
                                    .forEach(opt => audioOutputDeviceSelector.appendChild(opt));
                            }
                        });

                        audioOutputDeviceSelector.addEventListener("input", (evt) => {
                            if (audioOutputDevices) {
                                const audioOutputDevice = audioOutputDevices[audioOutputDeviceSelector.selectedIndex];
                                if (audioOutputDevice !== lastAudioOutputDevice) {
                                    this.jitsiClient.setAudioOutputDevice(audioOutputDevice);
                                    lastAudioOutputDevice = audioOutputDevice;
                                }
                            }
                        });

                        drawHearingCheckbox.checked = this.drawHearing;
                        drawHearingCheckbox.addEventListener("input", (evt) => {
                            this.drawHearing = drawHearingCheckbox.checked;
                            localStorage.setItem("drawHearing", this.drawHearing);
                        });

                        const setAudioRange = () => {
                            this.audioDistanceMin = parseFloat(minAudioSpinner.value);

                            this.audioDistanceMax = parseFloat(maxAudioSpinner.value);
                            this.audioDistanceMax = Math.max(this.audioDistanceMin + 1, this.audioDistanceMax);
                            maxAudioSpinner.value = this.audioDistanceMax;

                            this.rolloff = parseFloat(rolloffSpinner.value);

                            localStorage.setItem("minAudio", this.audioDistanceMin);
                            localStorage.setItem("maxAudio", this.audioDistanceMax);
                            localStorage.setItem("rolloff", 10 * this.rolloff);

                            this.updateAudioSettings();
                        };

                        minAudioSpinner.value = this.audioDistanceMin;
                        maxAudioSpinner.value = this.audioDistanceMax;
                        rolloffSpinner.value = this.rolloff;
                        minAudioSpinner.addEventListener("input", setAudioRange);
                        maxAudioSpinner.addEventListener("input", setAudioRange);
                        rolloffSpinner.addEventListener("input", setAudioRange);

                        this.muteAudioButton.addEventListener("click", (evt) => {
                            this.jitsiClient.toggleAudio();
                        });
                    }

                    this.setUserAudioMuted(false);
                }
                // <<<<<<<<<< AUDIO <<<<<<<<<<

                // >>>>>>>>>> VIDEO >>>>>>>>>>
                {
                    const videoInputDeviceSelector = document.querySelector("#videoInputDevices");
                    this.muteVideoButton = document.querySelector("#muteVideo");
                    if (videoInputDeviceSelector
                        && this.muteVideoButton) {
                        this.muteVideoButton.addEventListener("click", (evt) => {
                            this.jitsiClient.toggleVideo();
                        });

                        let lastVideoInputDevice = null,
                            videoInputDevices = null;

                        this.addEventListener("optionsOpened", async (evt) => {
                            lastVideoInputDevice = await this.jitsiClient.getCurrentVideoInputDevice();
                            videoInputDevices = await this.jitsiClient.getVideoInputDevices();
                            videoInputDeviceSelector.innerHTML = "";
                            if (videoInputDevices.length === 0) {
                                videoInputDeviceSelector.lock();
                                videoInputDeviceSelector.appendChild(option("No video input devices available"));
                            }
                            else {
                                videoInputDeviceSelector.unlock();
                                videoInputDevices.map(v => option(v.label, {
                                    selected: !!lastVideoInputDevice && v.id === lastVideoInputDevice.id
                                })).forEach(opt => videoInputDeviceSelector.appendChild(opt));
                            }
                        });

                        videoInputDeviceSelector.addEventListener("input", (evt) => {
                            if (videoInputDevices) {
                                const videoInputDevice = videoInputDevices[videoInputDeviceSelector.selectedIndex];

                                if (videoInputDevice !== lastVideoInputDevice) {
                                    this.jitsiClient.setVideoInputDevice(videoInputDevice);
                                    lastVideoInputDevice = videoInputDevice;
                                }
                            }
                        });
                    }
                    this.setUserVideoMuted(true);
                }
                // <<<<<<<<<< VIDEO <<<<<<<<<<
            }
        }
        // <<<<<<<<<< OPTIONS <<<<<<<<<<

        // >>>>>>>>>> VIEWS >>>>>>>>>>
        {
            this.appView = document.querySelector("#appView");
            this.guiView = document.querySelector("#guiView");
            this.jitsiContainer = document.querySelector("#jitsi");
            this.toolbar = document.querySelector("#toolbar");
            if (this.appView
                && this.guiView
                && this.jitsiContainer
                && this.toolbar) {
                addEventListener("resize", () => this.resize.bind(this));
                addEventListener("resize", this.game.frontBuffer.resize.bind(this.game.frontBuffer));
            }
        }
        // <<<<<<<<<< VIEWS <<<<<<<<<<

        // >>>>>>>>>> LOGIN >>>>>>>>>>
        {
            this.loginView = document.querySelector("#login");
            this.roomSelector = document.querySelector("#existingRooms");
            this.newRoomButton = document.querySelector("#createNewRoom");
            this.roomNameInput = document.querySelector("#roomName");
            this.userNameInput = document.querySelector("#userName");
            this.connectButton = document.querySelector("#connect");
            const leaveButton = document.querySelector("#leave");
            if (this.loginView
                && this.roomSelector
                && this.newRoomButton
                && this.roomNameInput
                && this.userNameInput
                && this.connectButton
                && leaveButton) {
                this.roomNameInput.addEventListener("enter", this.userNameInput.focus.bind(this.userNameInput));
                this.userNameInput.addEventListener("enter", this.login.bind(this));
                this.connectButton.addEventListener("click", this.login.bind(this));
                this.roomSelector.addEventListener("input", (evt) => {
                    this.roomNameInput.value = this.roomSelector.value;
                });
                this.newRoomButton.addEventListener("click", (evt) => {
                    const showSelector = this.roomNameInput.isOpen();
                    this.roomNameInput.setOpen(!showSelector);
                    this.roomSelector.setOpenWithLabel(showSelector, this.newRoomButton, "New", "Cancel");
                    if (showSelector) {
                        for (let option of this.roomSelector.options) {
                            if (option.value === this.roomNameInput.value) {
                                this.roomSelector.value = this.roomNameInput.value;
                            };
                        }
                    }

                    this.roomNameInput.value = this.roomSelector.value;
                });

                leaveButton.addEventListener("click", (evt) => {
                    this.game.end();
                });

                this.game.addEventListener("gameEnded", (evt) => {
                    this.jitsiClient.leave();
                    this.showLogin();
                });

                this.showLogin();

                this.userNameInput.value = localStorage.getItem("userName") || "";

                if (location.hash.length > 1) {
                    const name = location.hash.substr(1);
                    let found = false;
                    for (let option of this.roomSelector.options) {
                        if (option.value === name) {
                            this.roomSelector.value
                                = this.roomNameInput.value
                                = name;
                            found = true;
                            break;
                        };
                    }

                    if (!found) {
                        this.newRoomButton.click();
                        this.roomNameInput.value = name;
                    }

                    this.userNameInput.focus();
                }
                else {
                    this.roomNameInput.focus();
                    this.roomNameInput.value = this.roomSelector.value;
                }
            }
        }
        // <<<<<<<<<< LOGIN <<<<<<<<<<
    }

    setUserAudioMuted(muted) {
        this.muteAudioButton.updateLabel(muted, "Unmute", "Mute", ` audio (<kbd>${this.game.keyToggleAudio.toUpperCase()}</kbd>)`);
    }

    setUserVideoMuted(muted) {
        this.muteVideoButton.updateLabel(muted, "Enable", "Disable", " video");
    }

    refreshEmojiButton() {
        const emoji = this.game.currentEmoji,
            emojiValue = emoji && emoji.value || "@";
        this.emoteButton.innerHTML = `Emote (<kbd>${this.game.keyEmote.toUpperCase()}</kbd>) (${emojiValue})`
    }

    resize() {
        const topValue = this.toolbar.offsetHeight,
            height = `calc(100% - ${topValue}px)`;

        this.guiView.style.top
            = this.jitsiContainer.style.top
            = this.game.frontBuffer.style.top
            = topValue + "px";

        this.guiView.style.height
            = this.jitsiContainer.style.height
            = this.game.frontBuffer.style.height
            = height;
    }

    showLogin() {
        this.connectButton.unlock();
        this.roomNameInput.unlock();
        this.userNameInput.unlock();
        this.roomSelector.unlock();
        this.newRoomButton.unlock();

        this.appView.hide();
        this.jitsiContainer.innerHTML = "";
        this.loginView.show();
        this.connectButton.innerHTML = "Connect";
    }

    login() {
        this.connectButton.innerHTML = "Connecting...";
        this.connectButton.lock();
        this.roomNameInput.lock();
        this.userNameInput.lock();
        this.roomSelector.lock();
        this.newRoomButton.lock();
        const roomName = this.roomNameInput.value.trim(),
            userName = this.userNameInput.value.trim();

        if (roomName.length > 0
            && userName.length > 0) {
            localStorage.setItem("userName", userName);
            this.startConference(roomName, userName);
        }
        else {
            this.showLogin();

            if (roomName.length === 0) {
                this.roomNameInput.blinkBorder();
                this.roomNameInput.value = "";
                this.roomNameInput.focus();
            }
            else if (userName.length === 0) {
                this.userNameInput.blinkBorder();
                this.userNameInput.value = "";
                this.userNameInput.focus();
            }
        }
    }

    updateAudioSettings() {
        this.jitsiClient.setAudioProperties(
            location.origin,
            MOVE_TRANSITION_TIME,
            this.audioDistanceMin,
            this.audioDistanceMax,
            this.rolloff);
    }

    startConference(roomName, userName) {
        this.appView.show();
        location.hash = roomName;
        this.api = this.jitsiClient.join(
            this.jitsiContainer,
            roomName,
            () => {
                this.jitsiClient.setJitsiIFrame(this.api.getIFrame());
                this.updateAudioSettings();
            });

        this.jitsiClient.setJitsiApi(this.api);
        this.game.registerGameListeners(this.api);
        this.jitsiClient.setUserName(userName);
    }
}