import { TypedEvent } from "kudzu/events/EventBase";
import { id } from "kudzu/html/attrs";
import { Button, Div, InputEmail, InputText } from "kudzu/html/tags";
import { FormDialog } from "./FormDialog";
import { setLocked, setOpen } from "./ops";
import { SelectBox } from "./SelectBoxTag";
const loginEvt = new TypedEvent("login");
export class LoginForm extends FormDialog {
    constructor() {
        super("login");
        this._ready = false;
        this._connecting = false;
        this._connected = false;
        this.addEventListener("shown", () => this._ready = true);
        this.roomSelectControl = Div(id("roomSelectorControl"));
        this.roomEntryControl = Div(id("roomEntryControl"));
        const curRooms = new Array();
        const curOpts = this.element.querySelectorAll("#roomSelector option");
        for (let i = 0; i = curOpts.length; ++i) {
            const opt = curOpts[i];
            curRooms.push({
                ShortName: opt.value,
                Name: opt.textContent || opt.innerText
            });
        }
        this.roomSelect = SelectBox("roomSelector", "No rooms available", v => v.ShortName, v => v.Name);
        this.roomSelect.addEventListener("input", () => this.validate());
        this.roomSelect.emptySelectionEnabled = false;
        this.roomSelect.values = curRooms;
        this.roomSelect.selectedIndex = 0;
        this.roomInput = InputText(id("roomName"));
        this.roomInput.addEventListener("input", () => this.validate());
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
        this.userNameInput.addEventListener("input", () => this.validate());
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
        const checkInput = (evt) => {
            if (!evt.shiftKey
                && !evt.ctrlKey
                && !evt.altKey
                && !evt.metaKey
                && evt.key === "Enter"
                && this.userName.length > 0
                && this.roomName.length > 0) {
                this.dispatchEvent(loginEvt);
            }
        };
        this.connectButton.addEventListener("click", () => this.dispatchEvent(loginEvt));
        this.roomInput.addEventListener("keypress", checkInput);
        this.userNameInput.addEventListener("keypress", checkInput);
        this.addEventListener("login", () => {
            this.connecting = true;
        });
        this.roomSelectMode = true;
        this.validate();
    }
    validate() {
        const canConnect = this.roomName.length > 0
            && this.userName.length > 0;
        setLocked(this.connectButton, !this.ready
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
    get roomSelectMode() {
        return this.roomSelectControl.style.display !== "none";
    }
    set roomSelectMode(value) {
        setOpen(this.roomSelectControl, value);
        setOpen(this.roomEntryControl, !value);
        if (value) {
            this.roomSelect.selectedValue = { ShortName: this.roomInput.value };
        }
        else if (this.roomSelect.selectedIndex >= 0) {
            this.roomInput.value = this.roomSelect.selectedValue.ShortName;
        }
        this.validate();
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
        this.validate();
    }
    set userName(value) {
        this.userNameInput.value = value;
        this.validate();
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
        return this._ready;
    }
    set ready(v) {
        this._ready = v;
        this.validate();
    }
    get connecting() {
        return this._connecting;
    }
    set connecting(v) {
        this._connecting = v;
        this.validate();
    }
    get connected() {
        return this._connected;
    }
    set connected(v) {
        this._connected = v;
        this.connecting = false;
    }
}
//# sourceMappingURL=LoginForm.js.map