import { injectNewDOMMethods } from "./protos.js";

export class AppGui {
    constructor(game) {
        injectNewDOMMethods();
        this.game = game;
        this.menu = document.querySelector("#menu");
        this.menuControl = document.querySelector("#menuControl");
        this.jitsiContainer = document.querySelector("#jitsi");
        this.demoVideo = document.querySelector("#demo > video");
        this.loginView = document.querySelector("#loginView");
        this.roomNameInput = document.querySelector("#room");
        this.userNameInput = document.querySelector("#user");
        this.connectButton = document.querySelector("#connect");
        this.newRoomButton = document.querySelector("#createNewRoom");
        this.roomSelector = document.querySelector("#existingRooms");
        this.isFullGame = !!(this.menu
            && this.menuControl
            && this.jitsiContainer
            && this.demoVideo
            && this.loginView
            && this.roomNameInput
            && this.userNameInput
            && this.connectButton
            && this.newRoomButton
            && this.roomSelector);

        if (this.isFullGame) {
            this.menuControl.addEventListener("click", this.shrink.bind(this));
            this.roomNameInput.addEventListener("enter", this.userNameInput.focus.bind(this.userNameInput));
            this.userNameInput.addEventListener("enter", this.login.bind(this));
            this.connectButton.addEventListener("click", this.login.bind(this));
            this.roomSelector.addEventListener("change", (evt) => {
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

            if (location.hash.length > 0) {
                this.roomNameInput.value = location.hash.substr(1);
                for (let option in this.roomSelector.options) {
                    if (option.value === this.roomNameInput.value) {
                        this.roomSelector.value = this.roomNameInput.value;
                    };
                }
                this.userNameInput.focus();
            }
            else {
                this.roomNameInput.focus();
                this.roomNameInput.value = this.roomSelector.value;
            }
        }
    }

    shrink() {
        const isOpen = this.menu.className === "menu-open",
            ui = !!this.game.me ? this.game.frontBuffer : this.loginView

        this.menu.className = isOpen ? "menu-closed" : "menu-open";;

        if (isOpen) {
            ui.hide();
        }
        else {
            ui.show();
        }
    }

    showLogin() {
        this.connectButton.innerHTML = "Connect";
        this.connectButton.unlock();
        this.roomNameInput.unlock();
        this.userNameInput.unlock();
        this.roomSelector.unlock();
        this.newRoomButton.unlock();

        this.jitsiContainer.hide();
        this.game.frontBuffer.hide();
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
        this.jitsiContainer.show();

        location.hash = roomName;

        const api = new JitsiMeetExternalAPI(JITSI_HOST, {
            noSSL: false,
            disableThirdPartyRequests: true,
            parentNode: this.jitsiContainer,
            width: "100%",
            height: "100%",
            configOverwrite: {
                startAudioOnly: true
            },
            interfaceConfigOverwrite: {
                DISABLE_VIDEO_BACKGROUND: true
            },
            roomName: roomName,
            onload: (evt) => {
                this.game.jitsiClient.setJitsiApi(api);
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