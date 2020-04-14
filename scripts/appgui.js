import "./jitsi-meet-external-api.js";
import "./protos.js";

import { bestIcons } from "./emoji.js";

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
            this.optionsConfirmButton = document.querySelector("#options button.confirm");
            if (this.optionsButton
                && this.optionsView
                && this.optionsConfirmButton) {
                this.optionsButton.addEventListener("click", () => {
                    this.optionsView.toggleOpen();
                    this.optionsButton.innerHTML = (this.optionsView.isOpen()
                        ? "Hide"
                        : "Show")
                        + ` options (ALT+${this.optionsButton.accessKey.toUpperCase()})`;
                });
                this.optionsConfirmButton.addEventListener("click", this.optionsView.hide.bind(this.optionsView));
                this.optionsView.hide();
            }

            // >>>>>>>>>> FONT SIZE >>>>>>>>>>
            {
                this.fontSizeSpinner = document.querySelector("#fontSize");
                if (this.fontSizeSpinner) {
                    this.fontSizeSpinner.addEventListener("input", (evt) => {
                        const size = this.fontSizeSpinner.value;
                        this.game.fontSize = size;
                        localStorage.setItem("fontSize", size);
                    });
                    this.fontSizeSpinner.value = localStorage.getItem("fontSize") || this.game.fontSize;
                    this.game.fontSize = this.fontSizeSpinner.value;
                }
            }
            // <<<<<<<<<< FONT SIZE <<<<<<<<<<

            // >>>>>>>>>> HEARING >>>>>>>>>>
            {
                this.drawHearingCheckbox = document.querySelector("#drawHearing");
                this.minAudioSpinner = document.querySelector("#minAudio");
                this.maxAudioSpinner = document.querySelector("#maxAudio");
                if (this.drawHearingCheckbox
                    && this.minAudioSpinner
                    && this.maxAudioSpinner) {
                    this.drawHearingCheckbox.addEventListener("input", (evt) => {
                        this.game.drawHearing = this.drawHearingCheckbox.checked;
                        localStorage.setItem("drawHearing", this.game.drawHearing);
                    });
                    let drawHearing = localStorage.getItem("drawHearing");
                    drawHearing = drawHearing === null ? this.game.drawHearing : drawHearing === "true";
                    this.game.drawHearing = drawHearing;
                    this.drawHearingCheckbox.checked = drawHearing;

                    const setAudioRange = () => {
                        this.maxAudioSpinner.value = Math.max(1 * this.minAudioSpinner.value + 1, 1 * this.maxAudioSpinner.value);
                        AUDIO_DISTANCE_MIN = this.minAudioSpinner.value;
                        AUDIO_DISTANCE_MAX = this.maxAudioSpinner.value;
                        localStorage.setItem("minAudio", this.minAudioSpinner.value);
                        localStorage.setItem("maxAudio", this.maxAudioSpinner.value);
                    };
                    this.minAudioSpinner.addEventListener("input", setAudioRange);
                    this.maxAudioSpinner.addEventListener("input", setAudioRange);
                    AUDIO_DISTANCE_MIN = this.minAudioSpinner.value = 1 * localStorage.getItem("minAudio") || AUDIO_DISTANCE_MIN;
                    AUDIO_DISTANCE_MAX = this.maxAudioSpinner.value = 1 * localStorage.getItem("maxAudio") || AUDIO_DISTANCE_MAX;
                }
            }
            // <<<<<<<<<< HEARING <<<<<<<<<<
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
                    const open = this.roomNameInput.isOpen();
                    this.roomNameInput.style.display = open ? "none" : "";
                    this.roomSelector.style.display = open ? "" : "none";
                    this.newRoomButton.innerHTML = open ? "New" : "Cancel";
                    if (open) {
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
            this.previousEmoji = [];
            this.selectedEmoji = null;
            this.emojiView = document.querySelector("#emoji");
            this.emojiContainer = document.querySelector("#emojiList");
            this.recentEmoji = document.querySelector("#recentEmoji");
            this.emojiPreview = document.querySelector("#emojiPreview");
            this.confirmEmojiButton = document.querySelector("#emoji button.confirm");
            this.cancelEmojiButton = document.querySelector("#emoji button.cancel");
            this.emoteButton = document.querySelector("#emote");
            this.selectEmojiButton = document.querySelector("#selectEmoji");
            if (this.emojiView
                && this.emojiContainer
                && this.recentEmoji
                && this.emojiPreview
                && this.confirmEmojiButton
                && this.cancelEmojiButton
                && this.emoteButton
                && this.selectEmojiButton) {

                this.confirmEmojiButton.lock();

                const addIconsToContainer = (group, container) => {
                    for (let icon of group) {
                        const a = document.createElement("button");
                        a.type = "button";
                        a.addEventListener("click", this.previewEmoji.bind(this, icon));
                        a.title = icon.desc;
                        a.innerHTML = icon.value;
                        container.appendChild(a);
                    }
                };


                for (let key of Object.keys(bestIcons)) {
                    const header = document.createElement("h1"),
                        container = document.createElement("p"),
                        group = bestIcons[key];

                    header.innerHTML = key;
                    addIconsToContainer(group, container);

                    this.emojiContainer.appendChild(header);
                    this.emojiContainer.appendChild(container);
                }

                this.confirmEmojiButton.addEventListener("click", () => {
                    const idx = this.previousEmoji.indexOf(this.selectedEmoji);
                    this.emoteButton.innerHTML = `Emote (E) ${this.selectedEmoji.value}`;
                    if (idx === -1) {
                        this.previousEmoji.push(this.selectedEmoji);
                        this.recentEmoji.innerHTML = "";
                        addIconsToContainer(this.previousEmoji, this.recentEmoji);
                    }

                    this.dispatchEvent(new EmojiSelectedEvent(this.game.me.id, this.selectedEmoji));

                    this.emojiView.hide();
                });

                this.cancelEmojiButton.addEventListener("click", () => {
                    this.confirmEmojiButton.lock();
                    this.emojiView.hide();
                });

                this.emoteButton.addEventListener("click", () => {
                    this.game.emote({
                        participantID: this.game.me.id,
                        emoji: this.game.currentEmoji
                    });
                });

                this.selectEmojiButton.addEventListener("click", this.showEmoji.bind(this));
                this.addEventListener("emojiSelected", this.game.emote.bind(this.game));

                this.emojiView.hide();
            }
        }
        // <<<<<<<<<< EMOJI <<<<<<<<<<
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

    showEmoji() {
        this.emojiView.show();
    }

    previewEmoji(emoji) {
        this.selectedEmoji = emoji;
        this.emojiPreview.innerHTML = `${emoji.value} - ${emoji.desc}`;
        this.confirmEmojiButton.unlock();
    }

    showView(toggleGame) {
        if (toggleGame) {
            this.game.frontBuffer.toggleOpen();
        }

        this.showGameButton.innerHTML = (this.game.frontBuffer.isOpen()
            ? "Show"
            : "Hide")
            + ` meeting UI (ALT+${this.showGameButton.accessKey.toUpperCase()})`;
    }

    showLogin() {
        this.connectButton.innerHTML = "Connect";
        this.connectButton.unlock();
        this.roomNameInput.unlock();
        this.userNameInput.unlock();
        this.roomSelector.unlock();
        this.newRoomButton.unlock();

        this.appView.hide();
        this.loginView.show();
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
        api.addEventListener("videoConferenceJoined", (evt) => {
            this.loginView.hide();
            this.demoVideo.parentElement.hide();
        });

        addEventListener("unload", () => api.dispose());
    }
}

class EmojiSelectedEvent extends Event {
    constructor(participantID, emoji) {
        super("emojiSelected");

        this.participantID = participantID;
        this.emoji = emoji;
    }
}