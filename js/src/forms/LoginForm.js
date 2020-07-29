import "../protos.js";
import { SelectBox } from "../html/tags.js";
import { FormDialog } from "./FormDialog.js";

const defaultRooms = new Map([
    ["calla", "Calla"],
    ["island", "Island"],
    ["alxcc", "Alexandria Code & Coffee"],
    ["vurv", "Vurv"]]);

/** @type {WeakMap<LoginForm, LoginFormPrivate>} */
const selfs = new WeakMap();

class LoginFormPrivate {
    constructor(parent) {
        this.ready = false;
        this.connecting = false;
        this.connected = false;

        this.parent = parent;
    }

    validate() {
        const canConnect = this.parent.roomName.length > 0
            && this.parent.userName.length > 0;

        this.parent.connectButton.setLocked(!this.ready
            || this.connecting
            || this.connected
            || !canConnect);
        this.parent.connectButton.innerHTML =
            this.connected
                ? "Connected"
                : this.connecting
                    ? "Connecting..."
                    : this.ready
                        ? "Connect"
                        : "Loading...";
    }
}

export class LoginForm extends FormDialog {
    constructor() {
        super("login", "Login");
        const self = new LoginFormPrivate(this);
        selfs.set(this, self);

        const validate = () => self.validate();

        this.roomLabel = this.element.querySelector("label[for='roomSelector']");

        this.roomSelect = SelectBox(
            "No rooms available",
            v => v,
            k => defaultRooms.get(k),
            this.element.querySelector("#roomSelector"));
        this.roomSelect.addEventListener("input", validate);
        this.roomSelect.emptySelectionEnabled = false;
        this.roomSelect.values = defaultRooms.keys();
        this.roomSelect.selectedIndex = 0;

        this.roomInput = this.element.querySelector("#roomName");
        this.roomInput.addEventListener("input", validate);
        this.roomInput.addEventListener("enter", () => {
            this.userNameInput.focus();
        });

        this.userNameInput = this.element.querySelector("#userName")
        this.userNameInput.addEventListener("input", validate);
        this.userNameInput.addEventListener("enter", () => {
            if (this.userName.length === 0) {
                this.userNameInput.focus();
            }
            else if (this.roomName.length === 0) {
                if (this.roomSelectMode) {
                    this.roomSelect.focus();
                }
                else {
                    this.roomInput.focus();
                }
            }
        });

        this.createRoomButton = this.element.querySelector("#createNewRoom");
        this.createRoomButton.addEventListener("click", () => {
            this.roomSelectMode = !this.roomSelectMode;
        });

        this.connectButton = this.element.querySelector("#connect");
        this.addEventListener("login", () => {
            this.connecting = true;
        });

        this.roomSelectMode = true;

        self.validate();
    }

    addEventListener(evtName, callback, options) {
        if (evtName === "login") {
            this.connectButton.addEventListener("click", callback, options);
        }
        else {
            super.addEventListener(evtName, callback, options);
        }
    }

    removeEventListener(evtName, callback) {
        if (evtName === "login") {
            this.connectButton.removeEventListener("click", callback);
        }
        else {
            super.removeEventListener(evtName, callback);
        }
    }

    get roomSelectMode() {
        return this.roomSelect.style.display !== "none";
    }

    set roomSelectMode(value) {
        const self = selfs.get(this);
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

    get roomName() {
        const room = this.roomSelectMode
            ? this.roomSelect.selectedValue
            : this.roomInput.value;

        return room && room.toLocaleLowerCase() || "";
    }

    set roomName(v) {
        if (v === null
            || v === undefined
            || v.length === 0) {
            v = defaultRooms.keys().next();
        }

        this.roomInput.value = v;
        this.roomSelect.selectedValue = v;
        this.roomSelectMode = this.roomSelect.contains(v);
        selfs.get(this).validate();
    }

    set userName(value) {
        this.userNameInput.value = value;
        selfs.get(this).validate();
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
        const self = selfs.get(this);
        return self.ready;
    }

    set ready(v) {
        const self = selfs.get(this);
        self.ready = v;
        self.validate();
    }

    get connecting() {
        const self = selfs.get(this);
        return self.connecting;
    }

    set connecting(v) {
        const self = selfs.get(this);
        self.connecting = v;
        self.validate();
    }

    get connected() {
        const self = selfs.get(this);
        return self.connected;
    }

    set connected(v) {
        const self = selfs.get(this);
        self.connected = v;
        this.connecting = false;
    }

    show() {
        this.ready = true;
        super.show();
    }
}