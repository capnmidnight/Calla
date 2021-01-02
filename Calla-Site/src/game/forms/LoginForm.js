import { id } from "kudzu/html/attrs";
import { Button, Div, InputEmail, InputText } from "kudzu/html/tags";
import { FormDialog } from "./FormDialog";
import { setLocked, setOpen } from "./ops";
import { SelectBox } from "./SelectBoxTag";
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
        setLocked(this.parent.connectButton, !this.ready
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
        super("login");
        const self = new LoginFormPrivate(this);
        selfs.set(this, self);
        const validate = () => self.validate();
        this.addEventListener("shown", () => self.ready = true);
        this.roomSelectControl = Div(id("roomSelectorControl"));
        this.roomEntryControl = Div(id("roomEntryControl"));
        const curRooms = Array.prototype.map.call(this.element.querySelectorAll("#roomSelector option"), (opt) => {
            return {
                Name: opt.textContent || opt.innerText,
                ShortName: opt.value
            };
        });
        this.roomSelect = SelectBox("roomSelector", "No rooms available", v => v.ShortName, v => v.Name);
        this.roomSelect.addEventListener("input", validate);
        this.roomSelect.emptySelectionEnabled = false;
        this.roomSelect.values = curRooms;
        this.roomSelect.selectedIndex = 0;
        this.roomInput = InputText(id("roomName"));
        this.roomInput.addEventListener("input", validate);
        this.roomInput.addEventListener("keypress", (evt) => {
            if (evt.key === "Enter") {
                if (this.userName.length === 0) {
                    this.userNameInput.focus();
                }
                else if (this.email.length === 0) {
                    this.emailInput.focus();
                }
            }
        });
        this.userNameInput = InputText(id("userName"));
        this.userNameInput.addEventListener("input", validate);
        this.userNameInput.addEventListener("keypress", (evt) => {
            if (evt.key === "Enter") {
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
            }
        });
        /** @type {HTMLInputElement} */
        this.emailInput = InputEmail(id("email"));
        this.emailInput.addEventListener("keypress", (evt) => {
            if (evt.key === "Enter") {
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
            }
        });
        const createRoomButton = Button(id("createNewRoom"));
        createRoomButton.addEventListener("click", () => {
            this.roomSelectMode = false;
        });
        const selectRoomButton = Button(id("selectRoom"));
        selectRoomButton.addEventListener("click", () => {
            this.roomSelectMode = true;
        });
        this.connectButton = Button(id("connect"));
        this.addEventListener("login", () => {
            this.connecting = true;
        });
        this.roomSelectMode = true;
        self.validate();
    }
    /**
     * @param {KeyboardEvent} evt
     * @param {Function} callback
     */
    _checkInput(evt, callback) {
        if (!evt.shiftKey
            && !evt.ctrlKey
            && !evt.altKey
            && !evt.metaKey
            && evt.key === "Enter"
            && this.userName.length > 0
            && this.roomName.length > 0) {
            callback(evt);
        }
    }
    addEventListener(evtName, callback, options) {
        if (evtName === "login") {
            this.connectButton.addEventListener("click", callback, options);
            this.roomInput.addEventListener("keypress", (evt) => this._checkInput(evt, callback));
            this.userNameInput.addEventListener("keypress", (evt) => this._checkInput(evt, callback));
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
        return this.roomSelectControl.style.display !== "none";
    }
    set roomSelectMode(value) {
        const self = selfs.get(this);
        setOpen(this.roomSelectControl, value);
        setOpen(this.roomEntryControl, !value);
        if (value) {
            this.roomSelect.selectedValue = { ShortName: this.roomInput.value };
        }
        else if (this.roomSelect.selectedIndex >= 0) {
            this.roomInput.value = this.roomSelect.selectedValue.ShortName;
        }
        self.validate();
    }
    get roomName() {
        const room = this.roomSelectMode
            ? this.roomSelect.selectedValue && this.roomSelect.selectedValue.ShortName
            : this.roomInput.value;
        return room || "";
    }
    set roomName(v) {
        if (v === null
            || v === undefined
            || v.length === 0) {
            v = this.roomSelect.values[0].ShortName;
        }
        this.roomInput.value = v;
        this.roomSelect.selectedValue = { ShortName: v };
        this.roomSelectMode = this.roomSelect.selectedIndex > -1;
        selfs.get(this).validate();
    }
    set userName(value) {
        this.userNameInput.value = value;
        selfs.get(this).validate();
    }
    get userName() {
        return this.userNameInput.value;
    }
    set email(value) {
        this.emailInput.value = value;
    }
    get email() {
        return this.emailInput.value;
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
}
//# sourceMappingURL=LoginForm.js.map