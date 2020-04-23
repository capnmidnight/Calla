import(`https://${JITSI_HOST}/libs/external_api.min.js`);
import "./protos.js";

import { EmojiForm } from "./emojiForm.js";
import { bust } from "./emoji.js";
import { clamp } from "./math.js";

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

                // >>>>>>>>>> HEARING >>>>>>>>>>
                {
                    const drawHearingCheckbox = document.querySelector("#drawHearing"),
                        minAudioSpinner = document.querySelector("#minAudio"),
                        maxAudioSpinner = document.querySelector("#maxAudio"),
                        rolloffSpinner = document.querySelector("#rolloff");

                    this.drawHearing = localStorage.getItem("drawHearing") === "true";

                    this.audioDistanceMin = localStorage.getInt("minAudio", 2);
                    this.audioDistanceMin = Math.max(1, this.audioDistanceMin);
                    this.audioDistanceMax = localStorage.getInt("maxAudio", 10);
                    this.audioDistanceMax = Math.max(this.audioDistanceMin + 1, this.audioDistanceMax);
                    this.rolloff = localStorage.getInt("rolloff", 50) / 10;
                    this.rolloff = Math.max(0.1, Math.min(10, this.rolloff));

                    if (drawHearingCheckbox
                        && minAudioSpinner
                        && maxAudioSpinner) {

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
                    }
                }
                // <<<<<<<<<< HEARING <<<<<<<<<<

                // >>>>>>>>>> AUDIO >>>>>>>>>>
                {
                    this.muteAudioButton = document.querySelector("#muteAudio");
                    if (this.muteAudioButton) {
                        this.muteAudioButton.addEventListener("click", (evt) => {
                            this.jitsiClient.toggleAudio();
                        });
                    }
                    this.setUserAudioMuted(false);
                }
                // <<<<<<<<<< AUDIO <<<<<<<<<<

                // >>>>>>>>>> VIDEO >>>>>>>>>>
                {
                    this.muteVideoButton = document.querySelector("#muteVideo");
                    if (this.muteVideoButton) {
                        this.muteVideoButton.addEventListener("click", (evt) => {
                            this.jitsiClient.toggleVideo();
                        });
                    }
                    this.setUserVideoMuted(false);
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
            this.showGameButton = document.querySelector("#showGame");
            if (this.appView
                && this.guiView
                && this.jitsiContainer
                && this.toolbar
                && this.showGameButton) {
                addEventListener("resize", () => this.resize.bind(this));
                addEventListener("resize", this.game.frontBuffer.resize.bind(this.game.frontBuffer));
                this.showGameButton.addEventListener("click", this.showView.bind(this, true));
                this.showView(false);
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

    showView(toggleGame) {
        this.game.frontBuffer.setOpenWithLabel(
            toggleGame !== this.game.frontBuffer.isOpen(),
            this.showGameButton,
            "Show", "Hide", " meeting UI");
    }

    showLogin() {
        this.connectButton.unlock();
        this.roomNameInput.unlock();
        this.userNameInput.unlock();
        this.roomSelector.unlock();
        this.newRoomButton.unlock();

        this.appView.hide();
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

    setJitsiApi(api) {
        this.api = api;
        this.jitsiClient.setJitsiApi(this.api);
        this.game.registerGameListeners(this.api);
    }

    setJitsiIFrame() {
        this.jitsiClient.setJitsiIFrame(this.api.getIFrame());
        this.updateAudioSettings();
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

        this.api = new JitsiMeetExternalAPI(JITSI_HOST, {
            noSSL: false,
            disableThirdPartyRequests: true,
            parentNode: this.jitsiContainer,
            width: "100%",
            height: "100%",
            configOverwrite: {
                startVideoMuted: 0,
                startWithVideoMuted: true
            },
            interfaceConfigOverwrite: {
                DISABLE_VIDEO_BACKGROUND: true,
                SHOW_JITSI_WATERMARK: false,
                SHOW_WATERMARK_FOR_GUESTS: false,
                SHOW_POWERED_BY: true,
                AUTHENTICATION_ENABLE: false,
                MOBILE_APP_PROMO: false
            },
            roomName: roomName,
            onload: this.setJitsiIFrame.bind(this, null)
        });

        addEventListener("unload", () => {
            this.api.dispose();
        });

        this.setJitsiApi(this.api);
        this.api.executeCommand("displayName", userName);
    }
}