import "./jitsi-meet-external-api.js";
import "./protos.js";

import { bestIcons } from "./emoji.js";

export class AppGui {
    constructor(game) {
        this.game = game;

        this.eventHandlers = {
            emojiSelected: []
        };

        // ======= FONT SIZE ==========
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
        // ======= FONT SIZE ==========

        // ======= ZOOM ==========
        this.zoomSpinner = document.querySelector("#zoom");
        if (this.zoomSpinner) {
            this.zoomSpinner.addEventListener("input", (evt) => {
                this.game.targetCameraZ = this.zoomSpinner.value;
            });
            this.zoomSpinner.value = this.game.targetCameraZ;
        }
        // ======= ZOOM ==========

        // ======= HEARING ==========
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
        // ======= HEARING ==========

        // ======= VIEWS ==========
        this.gameVisible = true;
        this.jitsiVisible = true;
        this.viewsCombined = true;
        this.appView = document.querySelector("#appView");
        this.separator = document.querySelector("#separator");
        this.showGameButton = document.querySelector("#showGame");
        this.showJitsiButton = document.querySelector("#showJitsi");
        this.mixViewsButton = document.querySelector("#mixViews");
        this.jitsiContainer = document.querySelector("#jitsi");
        if (this.appView
            && this.separator
            && this.showGameButton
            && this.showJitsiButton
            && this.mixViewsButton
            && this.jitsiContainer) {
            this.showGameButton.addEventListener("click", this.showView.bind(this, true, false, false));
            this.showJitsiButton.addEventListener("click", this.showView.bind(this, false, true, false));
            this.mixViewsButton.addEventListener("click", this.showView.bind(this, false, false, true));
            this.showView(false, false, false);
        }
        else {
            if (this.showGameButton) {
                this.showGameButton.lock();
            }
            if (this.showJitsiButton) {
                this.showJitsiButton.lock();
            }
            if (this.mixViewsButton) {
                this.mixViewsButton.lock();
            }
        }

        // ======= VIEWS ==========

        // ======= LOGIN ==========
        this.demoVideo = document.querySelector("#demo > video");
        this.loginView = document.querySelector("#loginView");
        this.roomNameInput = document.querySelector("#roomName");
        this.userNameInput = document.querySelector("#userName");
        this.connectButton = document.querySelector("#connect");
        this.newRoomButton = document.querySelector("#createNewRoom");
        this.roomSelector = document.querySelector("#existingRooms");
        if (this.demoVideo
            && this.loginView
            && this.roomNameInput
            && this.userNameInput
            && this.connectButton
            && this.newRoomButton
            && this.roomSelector) {
            this.roomNameInput.addEventListener("enter", this.userNameInput.focus.bind(this.userNameInput));
            this.userNameInput.addEventListener("enter", this.login.bind(this));
            this.connectButton.addEventListener("click", this.login.bind(this));
            this.roomSelector.addEventListener("input", (evt) => {
                this.roomNameInput.value = this.roomSelector.value;
            });
            this.newRoomButton.addEventListener("click", (evt) => {
                const open = this.roomNameInput.style.display !== "none";
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
        // ======= LOGIN ==========

        // ======= EMOJI ==========
        this.previousEmoji = [];
        this.selectedEmoji = null;
        this.emojiWindow = document.querySelector("#emoji");
        this.emojiContainer = document.querySelector("#emojiList");
        this.recentEmoji = document.querySelector("#recentEmoji");
        this.emojiPreview = document.querySelector("#emojiPreview");
        this.confirmEmojiButton = document.querySelector("#emoji button.confirm");
        this.cancelEmojiButton = document.querySelector("#emoji button.cancel");
        this.emoteButton = document.querySelector("#emote");
        this.selectEmojiButton = document.querySelector("#selectEmoji");
        if (this.emojiWindow
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

                for (let func of this.eventHandlers.emojiSelected) {
                    func(this.game.me.id, this.selectedEmoji);
                }
                this.emojiWindow.hide();
            });

            this.cancelEmojiButton.addEventListener("click", () => {
                this.confirmEmojiButton.lock();
                this.emojiWindow.hide();
            });

            this.emoteButton.addEventListener("click", () => {
                this.game.emote(this.game.me.id, this.game.currentEmoji);
            });

            this.selectEmojiButton.addEventListener("click", this.showEmoji.bind(this));

            this.emojiWindow.hide();
        }
        // ======= EMOJI ==========
    }

    addEventListener(eventName, func) {
        this.eventHandlers[eventName].push(func);
    }

    showEmoji() {
        this.emojiWindow.show();
    }

    previewEmoji(emoji) {
        this.selectedEmoji = emoji;
        this.emojiPreview.innerHTML = `${emoji.value} - ${emoji.desc}`;
        this.confirmEmojiButton.unlock();
    }

    showView(toggleGame, toggleJitsi, toggleMixViews) {
        const showGame = this.gameVisible !== toggleGame,
            showJitsi = this.jitsiVisible !== toggleJitsi,
            mixViews = this.viewsCombined != toggleMixViews;

        this.gameVisible = showGame || !showJitsi && toggleJitsi;
        this.jitsiVisible = showJitsi || !showGame && toggleGame;
        this.viewsCombined = mixViews;

        this.showGameButton.innerHTML = (this.gameVisible ? "Hide" : "Show") + ` game (ALT+${this.showGameButton.accessKey.toUpperCase()})`;
        this.showJitsiButton.innerHTML = (this.jitsiVisible ? "Hide" : "Show") + ` meeting (ALT+${this.showJitsiButton.accessKey.toUpperCase()})`;
        this.mixViewsButton.innerHTML = (this.viewsCombined ? "Separate" : "Combine") + ` game/meeting (ALT+${this.mixViewsButton.accessKey.toUpperCase()})`;

        if (this.gameVisible != this.jitsiVisible) {
            this.mixViewsButton.lock();
        }
        else {
            this.mixViewsButton.unlock();
        }

        const sepSize = this.separator.offsetHeight,
            halfSize = `calc(50% - ${sepSize / 2}px)`,
            fullSize = `calc(100% - ${sepSize}px)`,
            containerSize = this.viewsCombined || !this.jitsiVisible || !this.gameVisible
                ? fullSize
                : halfSize;

        this.game.frontBuffer.style.height = this.gameVisible ? containerSize : "0";
        this.jitsiContainer.style.height = this.jitsiVisible ? containerSize : "0";

        if (this.viewsCombined) {
            this.appView.insertBefore(this.separator, this.jitsiContainer);
            this.game.frontBuffer.style.position = "absolute";
            this.game.frontBuffer.style.top = sepSize + "px";
        }
        else {
            this.appView.insertBefore(this.separator, this.game.frontBuffer);
            this.game.frontBuffer.style.position = "";
            this.game.frontBuffer.style.top = "";
        }

        this.game.frontBuffer.resize();
    }

    showLogin() {
        this.connectButton.innerHTML = "Connect";
        this.connectButton.unlock();
        this.roomNameInput.unlock();
        this.userNameInput.unlock();
        this.roomSelector.unlock();
        this.newRoomButton.unlock();

        this.appView.hide();
        this.demoVideo.parentElement.show();
        this.demoVideo.show();
        this.demoVideo.play();
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
            this.demoVideo.pause();
            this.demoVideo.hide();
            this.demoVideo.parentElement.hide();
        });

        addEventListener("unload", () => api.dispose());
    }
}