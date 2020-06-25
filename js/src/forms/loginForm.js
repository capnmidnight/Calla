import "../protos.js";

import { FormDialog } from "./formDialog.js";

import { SelectBox } from "../html/tags.js";

const loginEvt = new Event("login"),
    defaultRooms = new Map([
        ["calla", "Calla"],
        ["island", "Island"],
        ["alxcc", "Alexandria Code & Coffee"],
        ["vurv", "Vurv"]]),
    _state = new Map();

export class LoginForm extends FormDialog {
    constructor() {
        super("login");

        const self = Object.seal({
            ready: false,
            connecting: false,
            connected: false,
            validate: () => {
                const canConnect = (this.roomSelectMode
                    ? this.roomSelect.selectedIndex >= 0
                    : this.roomInput.value.length > 0)
                    && this.userName.length > 0;

                this.connectButton.setLocked(!this.ready
                    || this.connecting
                    || this.connected
                    || !canConnect);
                this.connectButton.innerHTML =
                    this.connected
                        ? "Connected"
                        : this.connecting
                            ? "Connecting..."
                            : this.ready
                                ? "Connect"
                                : "Loading...";
            }
        });

        _state.set(this, self);

        this.roomLabel = this.element.querySelector("label[for='roomSelector']");
        this.roomSelect = SelectBox("No rooms available", this.element.querySelector("#roomSelector"));
        this.roomInput = this.element.querySelector("#roomName");
        this.createRoomButton = this.element.querySelector("#createNewRoom");
        this.userNameInput = this.element.querySelector("#userName")
        this.connectButton = this.element.querySelector("#connect");

        this.roomInput.addEventListener("input", self.validate);
        this.userNameInput.addEventListener("input", self.validate);
        this.createRoomButton.addEventListener("click", () => {
            this.roomSelectMode = !this.roomSelectMode;
        });
        this.connectButton.addEventListener("click", () => {
            this.connecting = true;
            this.dispatchEvent(loginEvt);
        });

        this.roomSelect.setValues(
            defaultRooms.keys(),
            (k) => defaultRooms.get(k));
        this.roomSelectMode = true;
        this.roomSelect.selectedIndex = 0;

        self.validate();
    }

    get roomSelectMode() {
        return this.roomSelect.style.display !== "none";
    }

    set roomSelectMode(value) {
        const self = _state.get(this);
        this.roomSelect.setOpen(value);
        this.roomInput.setOpen(!value);
        this.createRoomButton.innerHTML = value
            ? "New"
            : "Cancel";

        if (value) {
            this.roomLabel.htmlFor = this.roomSelect.id;
            this.roomSelect.selectedValue = this.roomInput.value.toLocaleLowerCase();
        }
        else if (this.roomSelect.selectedIndex >= 0) {
            this.roomLabel.htmlFor = this.roomInput.id;
            this.roomInput.value = this.roomSelect.selectedValue;
        }

        self.validate();
    }

    get selectedRoom() {
        const room = this.roomSelectMode
            ? this.roomSelect.selectedValue
            : this.roomInput.value;

        return room.toLocaleLowerCase();
    }

    get userName() {
        return this.userNameInput.value;
    }

    get connectButtonText() {
        return this.connectButton.innerText
            || this.connectButton.textContent;
    }

    set connectButtonText(str) {
        this.connectButton.innerHTML = str;
    }

    get ready() {
        const self = _state.get(this);
        return self.ready;
    }

    set ready(v) {
        const self = _state.get(this);
        self.ready = v;
        self.validate();
    }

    get connecting() {
        const self = _state.get(this);
        return self.connecting;
    }

    set connecting(v) {
        const self = _state.get(this);
        self.connecting = v;
        self.validate();
    }

    get connected() {
        const self = _state.get(this);
        return self.connected;
    }

    set connected(v) {
        const self = _state.get(this);
        self.connected = v;
        this.connecting = false;
    }

    show() {
        this.ready = true;
        super.show();
    }
}