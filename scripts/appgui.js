import "./jitsi-meet-external-api.js";
import "./protos.js";

import { EmojiForm } from "./emojiForm.js";

export class AppGui extends EventTarget {
    constructor(game) {
        super();

        this.game = game;

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

        // >>>>>>>>>> OPTIONS >>>>>>>>>>
        {
            this.optionsButton = document.querySelector("#showOptions");
            this.optionsView = document.querySelector("#options");
            this.avatarURLInput = document.querySelector("#avatarURL");
            const optionsConfirmButton = document.querySelector("#options button.confirm");
            if (this.optionsButton
                && this.optionsView
                && this.avatarURLInput
                && optionsConfirmButton) {

                this.optionsButton.addEventListener("click", this.showOptions.bind(this, true));
                optionsConfirmButton.addEventListener("click", this.showOptions.bind(this, true));

                this.optionsView.hide();
                this.showOptions(false);
            }

            // >>>>>>>>>> FONT SIZE >>>>>>>>>>
            {
                const fontSizeSpinner = document.querySelector("#fontSize");
                if (fontSizeSpinner) {
                    fontSizeSpinner.addEventListener("input", (evt) => {
                        const size = fontSizeSpinner.value;
                        this.game.fontSize = size;
                        localStorage.setItem("fontSize", size);
                    });
                    fontSizeSpinner.value = localStorage.getItem("fontSize") || this.game.fontSize;
                    this.game.fontSize = fontSizeSpinner.value;
                }
            }
            // <<<<<<<<<< FONT SIZE <<<<<<<<<<

            // >>>>>>>>>> HEARING >>>>>>>>>>
            {
                const drawHearingCheckbox = document.querySelector("#drawHearing"),
                    minAudioSpinner = document.querySelector("#minAudio"),
                    maxAudioSpinner = document.querySelector("#maxAudio");
                if (drawHearingCheckbox
                    && minAudioSpinner
                    && maxAudioSpinner) {
                    drawHearingCheckbox.addEventListener("input", (evt) => {
                        this.game.drawHearing = drawHearingCheckbox.checked;
                        localStorage.setItem("drawHearing", this.game.drawHearing);
                    });
                    let drawHearing = localStorage.getItem("drawHearing");
                    drawHearing = drawHearing === null ? this.game.drawHearing : drawHearing === "true";
                    this.game.drawHearing = drawHearing;
                    drawHearingCheckbox.checked = drawHearing;

                    const setAudioRange = () => {
                        maxAudioSpinner.value = Math.max(1 * minAudioSpinner.value + 1, 1 * maxAudioSpinner.value);
                        AUDIO_DISTANCE_MIN = minAudioSpinner.value;
                        AUDIO_DISTANCE_MAX = maxAudioSpinner.value;
                        localStorage.setItem("minAudio", minAudioSpinner.value);
                        localStorage.setItem("maxAudio", maxAudioSpinner.value);
                    };
                    minAudioSpinner.addEventListener("input", setAudioRange);
                    maxAudioSpinner.addEventListener("input", setAudioRange);
                    AUDIO_DISTANCE_MIN = minAudioSpinner.value = 1 * localStorage.getItem("minAudio") || AUDIO_DISTANCE_MIN;
                    AUDIO_DISTANCE_MAX = maxAudioSpinner.value = 1 * localStorage.getItem("maxAudio") || AUDIO_DISTANCE_MAX;
                }
            }
            // <<<<<<<<<< HEARING <<<<<<<<<<

            // >>>>>>>>>> AUDIO >>>>>>>>>>
            {
                this.muteAudioButton = document.querySelector("#muteAudio");
                if (this.muteAudioButton) {
                    this.muteAudioButton.addEventListener("click", (evt) => {
                        this.game.jitsiClient.toggleAudio();
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
                        this.game.jitsiClient.toggleVideo();
                    });
                }
                this.setUserVideoMuted(false);
            }
            // <<<<<<<<<< VIDEO <<<<<<<<<<
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

                if (location.hash.length > 0) {
                    const name = location.hash.substr(1);
                    let found = false;
                    for (let option of this.roomSelector.options) {
                        if (option.value === this.roomNameInput.value) {
                            this.roomSelector.value = name;
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

        // >>>>>>>>>> EMOJI >>>>>>>>>>
        {
            const emojiView = document.querySelector("#emoji"),
                selectEmojiButton = document.querySelector("#selectEmoji"),
                emoteButton = document.querySelector("#emote");

            this.emojiForm = null;

            if (emojiView
                && emoteButton
                && selectEmojiButton) {

                this.emojiForm = new EmojiForm(emojiView);

                emoteButton.addEventListener("click", () => this.game.emote());

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
    }

    setUserAudioMuted(muted) {
        this.muteAudioButton.updateLabel(muted, "Unmute", "Mute", " audio");
    }

    setUserVideoMuted(muted) {
        this.muteVideoButton.updateLabel(muted, "Enable", "Disable", " video");
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

    showOptions(toggleOptions) {
        if ((!this.emojiView || !this.emojiView.isOpen())
            && (!this.loginView || !this.loginView.isOpen())) {
            this.optionsView.setOpenWithLabel(
                toggleOptions !== this.optionsView.isOpen(),
                this.optionsButton,
                "Hide", "Show", " options");

            if (toggleOptions
                && !this.optionsView.isOpen()
                && !!this.game.me
                && this.game.me.avatarURL !== this.avatarURLInput.value) {
                this.game.jitsiClient.setAvatar(this.avatarURLInput.value);
            }
        }
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

    startConference(roomName, userName) {
        this.appView.show();

        location.hash = roomName;

        const api = new JitsiMeetExternalAPI(JITSI_HOST, {
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
            onload: (evt) => {
                this.game.jitsiClient.setJitsiApi(api);

                this.game.jitsiClient.txJitsiHax("setAudioProperties", {
                    minDistance: AUDIO_DISTANCE_MIN,
                    maxDistance: AUDIO_DISTANCE_MAX,
                    transitionTime: MOVE_TRANSITION_TIME
                });
            }
        });
        api.executeCommand("displayName", userName);
        this.game.registerGameListeners(api);
        api.addEventListener("videoConferenceJoined", this.loginView.hide.bind(this.loginView));

        addEventListener("unload", () => api.dispose());
    }
}