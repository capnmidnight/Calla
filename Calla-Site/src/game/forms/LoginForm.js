import { TypedEvent } from "kudzu/events/EventBase";
import { autoComplete, htmlFor, id, list, placeHolder, required, title, value } from "kudzu/html/attrs";
import { onBlur, onClick, onInput, onKeyPress, onMouseDown } from "kudzu/html/evts";
import { Button, DataList, Form, InputEmail, InputText, Label, Option } from "kudzu/html/tags";
import { FormDialog } from "./FormDialog";
const loginEvt = new TypedEvent("login");
function isEnter(evt) {
    return !evt.shiftKey
        && !evt.ctrlKey
        && !evt.altKey
        && !evt.metaKey
        && evt.key === "Enter";
}
export class LoginForm extends FormDialog {
    _ready = false;
    _connecting = false;
    _connected = false;
    roomNameInput;
    userNameInput;
    emailInput;
    connectButton;
    constructor(rooms) {
        super("login", "Login", false);
        this.element.classList.add("dialog-1");
        this.addEventListener("shown", () => this._ready = true);
        const validator = () => this.validate();
        const onLoginAttempt = () => {
            if (this.userName.length > 0
                && this.roomName.length > 0) {
                this.connecting = true;
                this.dispatchEvent(loginEvt);
            }
        };
        let lastRoomName = null;
        this.content.append(DataList(id("roomsList"), ...rooms.map(room => Option(value(room.value), room.text))), Form(id("loginForm"), autoComplete(true), Label(htmlFor("userName"), "User:"), this.userNameInput = InputText(id("userName"), placeHolder("User name"), required(true), onInput(validator), onKeyPress((evt) => {
            if (isEnter(evt)) {
                if (this.userName.length === 0) {
                    this.userNameInput.focus();
                }
                else if (this.roomName.length === 0) {
                    this.roomNameInput.focus();
                }
                else {
                    onLoginAttempt();
                }
            }
        })), Label(htmlFor("email"), "Email:"), this.emailInput = InputEmail(id("email"), placeHolder("Email address (Optional)"), title("Email addresses are used to send updates about Calla."), onInput(validator), onKeyPress((evt) => {
            if (isEnter(evt)) {
                if (this.userName.length === 0) {
                    this.userNameInput.focus();
                }
                else if (this.roomName.length === 0) {
                    this.roomNameInput.focus();
                }
                else {
                    onLoginAttempt();
                }
            }
        })), Label(htmlFor("roomName"), "Room:"), this.roomNameInput = InputText(id("roomName"), list("roomsList"), placeHolder("Room name"), value("Calla"), required(true), onMouseDown(() => {
            lastRoomName = this.roomName;
            this.roomName = "";
        }, { capture: true }), onBlur(() => {
            if (this.roomName.length === 0) {
                this.roomName = lastRoomName;
            }
        }), onInput(validator), onKeyPress((evt) => {
            if (isEnter(evt)) {
                if (this.userName.length === 0) {
                    this.userNameInput.focus();
                }
                else if (this.email.length === 0) {
                    this.emailInput.focus();
                }
                else {
                    onLoginAttempt();
                }
            }
        })), this.connectButton = Button(id("connect"), onClick(onLoginAttempt))));
        this.validate();
    }
    validate() {
        this.connectButton.disabled = !this.ready
            || this.roomName.length === 0
            || this.userName.length === 0
            || this.connecting
            || this.connected;
        this.connectButton.innerHTML =
            this.connected
                ? "Connected"
                : this.connecting
                    ? "Connecting..."
                    : this.ready
                        ? "Connect"
                        : "Loading...";
    }
    get roomName() {
        return this.roomNameInput.value;
    }
    set roomName(v) {
        this.roomNameInput.value = v;
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