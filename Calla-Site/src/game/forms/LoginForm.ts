import { TypedEvent } from "kudzu/events/EventBase";
import { autoComplete, id, list, placeHolder, required, title, value } from "kudzu/html/attrs";
import { onBlur, onClick, onInput, onKeyPress, onMouseDown } from "kudzu/html/evts";
import { Button, Div, InputEmail, InputText } from "kudzu/html/tags";
import { FormDialog, FormDialogEvents } from "./FormDialog";
import { setLocked } from "./ops";

interface RoomEntry {
    ShortName: string;
    Name?: string;
}

interface LoginFormEvents extends FormDialogEvents {
    login: TypedEvent<"login">;
}

const loginEvt = new TypedEvent("login");

function isEnter(evt: KeyboardEvent) {
    return !evt.shiftKey
        && !evt.ctrlKey
        && !evt.altKey
        && !evt.metaKey
        && evt.key === "Enter";
}

export class LoginForm extends FormDialog<LoginFormEvents> {

    private _ready = false;
    private _connecting = false;
    private _connected = false;

    private roomNameInput: HTMLInputElement;
    private userNameInput: HTMLInputElement;
    private emailInput: HTMLInputElement;
    private connectButton: HTMLButtonElement;

    constructor() {
        super("login");

        this.addEventListener("shown", () => this._ready = true);

        const curRooms = new Array<RoomEntry>();
        const curOpts = this.element.querySelectorAll("#roomSelector option");
        for (let i = 0; i < curOpts.length; ++i) {
            const opt = curOpts[i] as HTMLOptionElement;
            curRooms.push({
                ShortName: opt.value,
                Name: opt.textContent || opt.innerText
            });
        }

        const validator = () => this.validate();

        const onLoginAttempt = () => {
            if (this.userName.length > 0
                && this.roomName.length > 0) {
                this.connecting = true;
                this.dispatchEvent(loginEvt);
            }
        };

        let lastRoomName: string = null;

        Div(
            id("userNameControl"),
            this.userNameInput = InputText(
                id("userName"),
                autoComplete(true),
                placeHolder("User name"),
                required(true),
                onInput(validator),
                onKeyPress((evt) => {
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
                })));

        Div(
            id("emailControl"),
            this.emailInput = InputEmail(
                id("email"),
                autoComplete(true),
                placeHolder("Email address (Optional)"),
                title("Email addresses are used to send updates about Calla."),
                onInput(validator),
                onKeyPress((evt) => {
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
                })));

        Div(
            id("roomControl"),
            this.roomNameInput = InputText(
                id("roomName"),
                autoComplete(true),
                list("roomsList"),
                placeHolder("Room name"),
                value("Calla"),
                required(true),
                onMouseDown(() => {
                    lastRoomName = this.roomName;
                    this.roomName = "";
                }, { capture: true }),
                onBlur(() => {
                    if (this.roomName.length === 0) {
                        this.roomName = lastRoomName;
                    }
                }),
                onInput(validator),
                onKeyPress((evt) => {
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
                })));

        Div(
            id("connectButtonControl"),
            this.connectButton = Button(
                id("connect"),
                onClick(onLoginAttempt)));

        this.validate();
    }

    private validate() {
        const canConnect = this.roomName.length > 0
            && this.userName.length > 0;

        setLocked(
            this.connectButton,
            !this.ready
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
