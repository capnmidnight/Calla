import { EmojiForm } from "./emojiForm.js";
import {
    bust,
    mutedSpeaker,
    videoCamera
} from "./emoji.js";
import { isGoodNumber } from "./math.js";
import {
    Div,
    Option,
    id,
    fillPageStyle,
    selected
} from "./html.js";
import { ToolBar } from "./toolbar.js";
import "./protos.js";

export class AppGui extends EventTarget {
    constructor(appViewElement, game, jitsiClient) {
        super();

        this.game = game;
        this.jitsiClient = jitsiClient;
        this.optionsView = null;
        this.emoteButton = null;

        // >>>>>>>>>> VIEWS >>>>>>>>>>
        {
            this.appView = appViewElement;
            this.emojiForm = new EmojiForm(document.querySelector("#emoji"));
            this.jitsiContainer = this.appView.appendChild(Div(
                id("jitsi"),
                fillPageStyle));
            this.appView.appendChild(this.game.frontBuffer);
            this.guiView = document.querySelector("#guiView");
            if (this.appView
                && this.guiView) {
                addEventListener("resize", () => {
                    this.resize();
                });
            }
        }
        // <<<<<<<<<< VIEWS <<<<<<<<<<

        // >>>>>>>>>> TOOLBAR >>>>>>>>>>
        this.toolbar = new ToolBar();
        this.appView.appendChild(this.toolbar.element);

        this.toolbar.addEventListener("toggleaudio", () => this.jitsiClient.toggleAudio());
        this.toolbar.addEventListener("leave", () => this.game.end());
        this.toolbar.addEventListener("emote", () => this.game.emote(this.game.me.id, this.game.currentEmoji));
        this.toolbar.addEventListener("selectemoji", () => this.selectEmojiAsync());
        this.toolbar.addEventListener("zoomchanged", () => this.game.targetCameraZ = this.toolbar.zoom);
        this.game.addEventListener("zoomchanged", () => this.toolbar.zoom = this.game.targetCameraZ);
        this.toolbar.addEventListener("tweet", () => {
            const message = encodeURIComponent(`Join my #TeleParty ${document.location.href}`),
                url = new URL("https://twitter.com/intent/tweet?text=" + message);
            open(url);
        });
        this.toolbar.addEventListener("toggleui", () => {
            this.game.frontBuffer.setOpen(this.toolbar.visible);
            this.resize();
        });
        // <<<<<<<<<< TOOLBAR <<<<<<<<<<

        // >>>>>>>>>> OPTIONS >>>>>>>>>>
        {
            this.optionsView = document.querySelector("#options");
            const optionsConfirmButton = document.querySelector("#options button.confirm");
            if (this.optionsView
                && optionsConfirmButton) {

                this.toolbar.addEventListener("options", (evt) => {
                    if (!this.emojiForm.isOpen()
                        && (!this.loginView || !this.loginView.isOpen())) {
                        this.optionsView.toggleOpen();
                        if (this.optionsView.isOpen()) {
                            this.dispatchEvent(new Event("optionsOpened"));
                        }
                    }
                });

                optionsConfirmButton.addEventListener("click", (evt) => {
                    if (this.optionsView.isOpen()) {
                        this.optionsView.hide();
                        this.dispatchEvent(new Event("optionsConfirmed"));
                    }
                });

                this.optionsView.hide();

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
                                let newAvatarURL = avatarURLInput.value;
                                if (newAvatarURL.length === 0) {
                                    newAvatarURL = null;
                                }

                                if (this.game.me.avatarURL !== newAvatarURL) {
                                    this.jitsiClient.setAvatarURL(newAvatarURL);
                                }

                                if (this.game.me.avatarEmoji !== avatarEmojiOutput.innerHTML) {
                                    this.game.me.avatarEmoji = avatarEmojiOutput.innerHTML;
                                    const evt = Object.assign({}, this.game.me);
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
                        setKeyOption(keyButtonToggleAudio, () => this.game.keyToggleAudio, v => this.game.keyToggleAudio = v);
                        setKeyOption(keyButtonEmote, () => this.game.keyEmote, v => {
                            this.game.keyEmote = v;
                            this.refreshEmojiButton();
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
                                gamepadSelector.appendChild(Option("No gamepads detected"));
                                gamepadSelector.lock();
                            }
                            else {
                                gamepadSelector.unlock();
                                gamepadSelector.append(...this.game.gamepads.map((pad, i) =>
                                    Option(
                                        pad.id,
                                        selected(i === this.game.gamepadIndex))));
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

                    this.game.drawHearing = localStorage.getItem("drawHearing") === "true";

                    this.game.audioDistanceMin = localStorage.getInt("minAudio", this.game.audioDistanceMin);
                    this.game.audioDistanceMin = Math.max(1, this.game.audioDistanceMin);
                    this.game.audioDistanceMax = localStorage.getInt("maxAudio", this.game.audioDistanceMax);
                    this.game.audioDistanceMax = Math.max(this.game.audioDistanceMin + 1, this.game.audioDistanceMax);
                    this.game.rolloff = localStorage.getInt("rolloff", this.game.rolloff * 10) / 10;
                    this.game.rolloff = Math.max(0.1, Math.min(10, this.game.rolloff));

                    if (audioInputDeviceSelector
                        && audioOutputDeviceSelector
                        && drawHearingCheckbox
                        && minAudioSpinner
                        && maxAudioSpinner) {

                        let lastAudioInputDevice = null,
                            audioInputDevices = null;

                        this.addEventListener("optionsOpened", async () => {
                            lastAudioInputDevice = await this.jitsiClient.getCurrentAudioInputDevice();
                            audioInputDevices = await this.jitsiClient.getAudioInputDevices();
                            audioInputDeviceSelector.innerHTML = "";
                            if (audioInputDevices.length === 0) {
                                audioInputDeviceSelector.lock();
                                audioInputDeviceSelector.appendChild(Option("No audio input devices available"));
                            }
                            else {
                                audioInputDeviceSelector.unlock();
                                audioInputDeviceSelector.append(...audioInputDevices.map(a =>
                                    Option(
                                        a.label,
                                        selected(!!lastAudioInputDevice && a.id === lastAudioInputDevice.id))));
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
                                audioOutputDeviceSelector.appendChild(Option("No audio output devices available"));
                            }
                            else {
                                audioOutputDeviceSelector.unlock();
                                audioOutputDeviceSelector.append(...audioOutputDevices.map(a =>
                                    Option(
                                        a.label,
                                        selected(!!lastAudioOutputDevice && a.id === lastAudioOutputDevice.id))));
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

                        drawHearingCheckbox.checked = this.game.drawHearing;
                        drawHearingCheckbox.addEventListener("input", (evt) => {
                            this.game.drawHearing = drawHearingCheckbox.checked;
                            localStorage.setItem("drawHearing", this.drawHearing);
                        });

                        const setAudioRange = () => {
                            this.game.audioDistanceMin = parseFloat(minAudioSpinner.value);

                            this.game.audioDistanceMax = parseFloat(maxAudioSpinner.value);
                            this.game.audioDistanceMax = Math.max(this.game.audioDistanceMin + 1, this.game.audioDistanceMax);
                            maxAudioSpinner.value = this.game.audioDistanceMax;

                            this.game.rolloff = parseFloat(rolloffSpinner.value);

                            localStorage.setItem("minAudio", this.game.audioDistanceMin);
                            localStorage.setItem("maxAudio", this.game.audioDistanceMax);
                            localStorage.setItem("rolloff", 10 * this.game.rolloff);

                            this.updateAudioSettings();
                        };

                        minAudioSpinner.value = this.game.audioDistanceMin;
                        maxAudioSpinner.value = this.game.audioDistanceMax;
                        rolloffSpinner.value = this.game.rolloff;
                        minAudioSpinner.addEventListener("input", setAudioRange);
                        maxAudioSpinner.addEventListener("input", setAudioRange);
                        rolloffSpinner.addEventListener("input", setAudioRange);
                    }
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
                                videoInputDeviceSelector.appendChild(Option("No video input devices available"));
                            }
                            else {
                                videoInputDeviceSelector.unlock();
                                videoInputDeviceSelector.append(...videoInputDevices.map(v =>
                                    Option(
                                        v.label,
                                        selected(!!lastVideoInputDevice && v.id === lastVideoInputDevice.id))));
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

        // >>>>>>>>>> LOGIN >>>>>>>>>>
        {
            this.loginView = document.querySelector("#login");
            this.roomSelector = document.querySelector("#existingRooms");
            this.newRoomButton = document.querySelector("#createNewRoom");
            this.roomNameInput = document.querySelector("#roomName");
            this.userNameInput = document.querySelector("#userName");
            this.connectButton = document.querySelector("#connect");

            if (this.loginView
                && this.roomSelector
                && this.newRoomButton
                && this.roomNameInput
                && this.userNameInput
                && this.connectButton) {
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
        this.toolbar.setAudioMuted(muted);
    }

    setUserVideoMuted(muted) {
        this.muteVideoButton.updateLabel(
            muted,
            mutedSpeaker.value,
            videoCamera.value);
    }

    async selectEmojiAsync() {
        if ((!this.optionsView || !this.optionsView.isOpen())
            && (!this.loginView || !this.loginView.isOpen())) {
            const emoji = await this.emojiForm.selectAsync();

            if (!!emoji) {
                const isNew = emoji !== this.game.currentEmoji;
                this.game.emote(this.game.me.id, emoji);
                if (isNew) {
                    this.refreshEmojiButton();
                }
            }
        }
    }

    refreshEmojiButton() {
        const emoji = this.game.currentEmoji,
            emojiValue = emoji && emoji.value || "@";
        this.toolbar.setEmojiButton(this.game.keyEmote, emojiValue);
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

        this.game.frontBuffer.resize();
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
            this.startConferenceAsync(roomName, userName);
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
            this.game.audioDistanceMin,
            this.game.audioDistanceMax,
            this.game.rolloff);
    }

    async startConferenceAsync(roomName, userName) {
        this.appView.show();
        location.hash = roomName;
        await this.jitsiClient.joinAsync(
            this.jitsiContainer,
            roomName,
            userName);
        this.updateAudioSettings();
    }
}